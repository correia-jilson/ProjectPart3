const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/api/block-height", async (req, res) => {
  try {
    const response = await axios.get("https://blockstream.info/api/blocks/tip/height");
    const blockHeight = response.data;
    res.json({ block_height: blockHeight });
  } catch (error) {
    console.error("Failed to fetch block height:", error);
    res.status(500).json({ error: "Failed to fetch block height" });
  }
});

app.get("/api/transaction-count", async (req, res) => {
  try {
    // First, get the latest block hash
    const heightResponse = await axios.get("https://blockstream.info/api/blocks/tip/height");
    const blockHeight = heightResponse.data;
    const hashResponse = await axios.get(`https://blockstream.info/api/block-height/${blockHeight}`);
    const blockHash = hashResponse.data;

    const blockResponse = await axios.get(`https://blockstream.info/api/block/${blockHash}`);
    const transactionCount = blockResponse.data.tx_count;
    res.json({ transaction_count: transactionCount });
  } catch (error) {
    console.error("Failed to fetch transaction count:", error);
    res.status(500).json({ error: "Failed to fetch transaction count" });
  }
});

app.get("/api/bitcoin-price", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_24hr_vol=true"
    );
    const data = response.data.bitcoin;
    const priceUsd = data.usd;
    const priceEur = data.eur;
    const volumeUsd = data.usd_24h_vol;
    res.json({ price_usd: priceUsd, price_eur: priceEur, volume_usd: volumeUsd });
  } catch (error) {
    console.error("Failed to fetch Bitcoin price:", error);
    res.status(500).json({ error: "Failed to fetch Bitcoin price" });
  }
});

// Endpoint to get Bitcoin dominance percentage
app.get("/api/bitcoin-dominance", async (req, res) => {
  try {
    const globalResponse = await axios.get("https://api.coingecko.com/api/v3/global");
    const btcDominance = globalResponse.data.data.market_cap_percentage.btc;
    res.json({ btc_dominance: btcDominance });
  } catch (error) {
    console.error("Failed to fetch Bitcoin dominance:", error);
    res.status(500).json({ error: "Failed to fetch Bitcoin dominance" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
