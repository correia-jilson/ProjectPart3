const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// CORS configuration to allow requests from frontend (http://localhost:3000)
app.use(cors({ origin: "http://localhost:3000" }));

// Sample endpoints with simulated data
app.get("/api/block-height", async (req, res) => {
  try {
    // Simulate fetching block height (replace with actual logic)
    const blockHeight = 754000;
    res.json({ block_height: blockHeight });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch block height" });
  }
});

app.get("/api/transaction-count", async (req, res) => {
  try {
    // Simulate fetching transaction count (replace with actual logic)
    const transactionCount = 2345;
    res.json({ transaction_count: transactionCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction count" });
  }
});

app.get("/api/bitcoin-price", async (req, res) => {
  try {
    // Simulate fetching Bitcoin price (replace with actual API call)
    const priceUsd = 50000;
    const priceEur = 47000;
    const volumeUsd = 100000000;
    res.json({ price_usd: priceUsd, price_eur: priceEur, volume_usd: volumeUsd });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Bitcoin price" });
  }
});

app.get("/api/bitcoin-dominance", async (req, res) => {
  try {
    // Simulate fetching Bitcoin dominance (replace with actual logic)
    const btcDominance = 45.6;
    res.json({ btc_dominance: btcDominance });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Bitcoin dominance" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
