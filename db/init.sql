CREATE TABLE IF NOT EXISTS block_info (
    id SERIAL PRIMARY KEY,
    block_height BIGINT NOT NULL,
    transaction_count INT
);

CREATE TABLE IF NOT EXISTS bitcoin_price (
    id SERIAL PRIMARY KEY,
    price_usd FLOAT,
    price_eur FLOAT,
    volume_usd FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bitcoin_metrics (
    id SERIAL PRIMARY KEY,
    btc_price_usd FLOAT,
    btc_price_eur FLOAT,
    btc_dominance FLOAT,
    volume_usd FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
