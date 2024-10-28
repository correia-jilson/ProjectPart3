use reqwest;
use tokio;
use tokio_postgres::{NoTls};
use std::time::Duration;
use dotenv::dotenv;
use std::env;

const RETRY_LIMIT: u32 = 3;
const RETRY_DELAY_SECS: u64 = 5;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    let postgres_user = env::var("DB_USER")?;
    let postgres_password = env::var("DB_PASSWORD")?;
    let postgres_db = env::var("DB_NAME")?;
    let postgres_host = env::var("DB_HOST")?;

    let db_connection_string = format!(
        "host={} user={} password={} dbname={}",
        postgres_host, postgres_user, postgres_password, postgres_db
    );

    let (db_client, connection) = tokio_postgres::connect(&db_connection_string, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Database connection error: {}", e);
        }
    });

    let client = reqwest::Client::new();

    // Fetch last processed block height from the database
    let mut last_block_height: i64 = match db_client
        .query_one("SELECT MAX(block_height) FROM block_info", &[])
        .await
    {
        Ok(row) => row.get::<usize, Option<i64>>(0).unwrap_or(0),
        Err(_) => 0,
    };

    loop {
        // Fetch current block height from Blockstream API
        if let Ok(current_block_height) = fetch_current_block_height(&client).await {
            // Process new blocks only
            if current_block_height > last_block_height {
                for height in (last_block_height + 1)..=current_block_height {
                    if let Some(block_hash_response) = fetch_with_retries(&client, &format!("https://blockstream.info/api/block-height/{}", height)).await {
                        let block_hash = block_hash_response.text().await.unwrap_or_default();
                        if let Some(tx_count) = fetch_transaction_count(&client, &block_hash).await {
                            db_client.execute(
                                "INSERT INTO block_info (block_height, transaction_count) VALUES ($1, $2)",
                                &[&height, &tx_count]
                            ).await?;
                            println!("Transaction count: {} for block height: {} ingested successfully", tx_count, height);
                        }
                    }
                }

                // Update last processed block height
                last_block_height = current_block_height;
            } else {
                println!("No new blocks to process. Current block height: {}", last_block_height);
            }
        }

        // Fetch Bitcoin price and 24-hour volume from CoinGecko API
        if let Ok((price_usd, price_eur, volume_usd)) = fetch_bitcoin_price_data(&client).await {
            db_client.execute(
                "INSERT INTO bitcoin_price (price_usd, price_eur, volume_usd) VALUES ($1, $2, $3)",
                &[&price_usd, &price_eur, &volume_usd],
            ).await?;

            println!("Bitcoin price (USD): ${}, (EUR): €{}, Volume: ${} ingested successfully", price_usd, price_eur, volume_usd);

            // Fetch global market cap for Bitcoin Dominance
            if let Ok(btc_dominance) = fetch_bitcoin_dominance(&client, price_usd).await {
                db_client.execute(
                    "INSERT INTO bitcoin_metrics (btc_price_usd, btc_price_eur, btc_dominance, volume_usd) VALUES ($1, $2, $3, $4)",
                    &[&price_usd, &price_eur, &btc_dominance, &volume_usd],
                ).await?;

                println!(
                    "Bitcoin price (USD): ${}, (EUR): €{}, Dominance: {}%, Volume: ${}",
                    price_usd, price_eur, btc_dominance, volume_usd
                );
            } else {
                eprintln!("Failed to calculate Bitcoin dominance.");
            }
        } else {
            eprintln!("Failed to fetch Bitcoin price data.");
        }

        tokio::time::sleep(Duration::from_secs(30)).await;
    }
}

async fn fetch_current_block_height(client: &reqwest::Client) -> Result<i64, Box<dyn std::error::Error>> {
    let response = fetch_with_retries(client, "https://blockstream.info/api/blocks/tip/height").await;
    if let Some(resp) = response {
        let height: i64 = resp.text().await?.parse()?;
        Ok(height)
    } else {
        Err("Failed to fetch current block height".into())
    }
}

async fn fetch_transaction_count(client: &reqwest::Client, block_hash: &str) -> Option<i64> {
    let block_details_url = format!("https://blockstream.info/api/block/{}", block_hash);
    if let Some(response) = fetch_with_retries(client, &block_details_url).await {
        if let Ok(block_json) = response.json::<serde_json::Value>().await {
            return block_json["tx_count"].as_i64();
        }
    }
    None
}

async fn fetch_bitcoin_price_data(client: &reqwest::Client) -> Result<(f64, f64, f64), Box<dyn std::error::Error>> {
    let price_response = fetch_with_retries(
        client,
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_24hr_vol=true",
    ).await;

    if let Some(resp) = price_response {
        let price_json = resp.json::<serde_json::Value>().await?;
        let price_usd = price_json["bitcoin"]["usd"].as_f64().unwrap_or(0.0);
        let price_eur = price_json["bitcoin"]["eur"].as_f64().unwrap_or(0.0);
        let volume_usd = price_json["bitcoin"]["usd_24h_vol"].as_f64().unwrap_or(0.0);
        return Ok((price_usd, price_eur, volume_usd));
    }
    Err("Failed to fetch Bitcoin price data".into())
}

async fn fetch_bitcoin_dominance(client: &reqwest::Client, price_usd: f64) -> Result<f64, Box<dyn std::error::Error>> {
    let global_response = fetch_with_retries(client, "https://api.coingecko.com/api/v3/global").await;
    if let Some(resp) = global_response {
        let global_json = resp.json::<serde_json::Value>().await?;
        if let Some(global_market_cap_usd) = global_json["data"]["total_market_cap"]["usd"].as_f64() {
            let btc_market_cap = price_usd * 21000000.0;
            let btc_dominance = (btc_market_cap / global_market_cap_usd) * 100.0;
            return Ok(btc_dominance);
        }
    }
    Err("Failed to fetch global market cap".into())
}

// Retry logic helper
async fn fetch_with_retries(client: &reqwest::Client, url: &str) -> Option<reqwest::Response> {
    for attempt in 0..RETRY_LIMIT {
        if let Ok(resp) = client.get(url).send().await {
            if resp.status().is_success() {
                return Some(resp);
            } else {
                eprintln!("Request to {} failed with status: {}", url, resp.status());
            }
        }
        eprintln!("Retry attempt {} for URL: {}", attempt + 1, url);
        tokio::time::sleep(Duration::from_secs(RETRY_DELAY_SECS)).await;
    }
    eprintln!("Failed to fetch {} after {} attempts", url, RETRY_LIMIT);
    None
}