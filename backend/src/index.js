const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get('/api/block-height', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX(block_height) AS block_height FROM block_info');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/transaction-count', async (req, res) => {
  try {
    const result = await pool.query('SELECT transaction_count FROM block_info ORDER BY block_height DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/bitcoin-price', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bitcoin_price ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/bitcoin-dominance', async (req, res) => {
  try {
    const result = await pool.query('SELECT btc_dominance FROM bitcoin_metrics ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
