import React, { useEffect, useState } from "react";

function App() {
  return (
    <div style={styles.app}>
      <Header />
      <main style={styles.main}>
        <BlockHeight />
        <TransactionCount />
        <BitcoinPrice />
        <BitcoinDominance />
      </main>
      <Footer />
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header style={styles.header}>
      <h1>Bitcoin Explorer</h1>
      <p>Track Bitcoin's blockchain metrics in real-time</p>
    </header>
  );
}

// BlockHeight Component
function BlockHeight() {
  const [blockHeight, setBlockHeight] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/block-height")
      .then((res) => res.json())
      .then((data) => setBlockHeight(data.block_height));
  }, []);

  return (
    <div style={styles.card}>
      <h2>Block Height</h2>
      <p>{blockHeight ? blockHeight : "Loading..."}</p>
    </div>
  );
}

// TransactionCount Component
function TransactionCount() {
  const [transactionCount, setTransactionCount] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/transaction-count")
      .then((res) => res.json())
      .then((data) => setTransactionCount(data.transaction_count));
  }, []);

  return (
    <div style={styles.card}>
      <h2>Transaction Count</h2>
      <p>{transactionCount ? transactionCount : "Loading..."}</p>
    </div>
  );
}

// BitcoinPrice Component
function BitcoinPrice() {
  const [priceUsd, setPriceUsd] = useState(null);
  const [priceEur, setPriceEur] = useState(null);
  const [volumeUsd, setVolumeUsd] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/bitcoin-price")
      .then((res) => res.json())
      .then((data) => {
        setPriceUsd(data.price_usd);
        setPriceEur(data.price_eur);
        setVolumeUsd(data.volume_usd);
      });
  }, []);

  return (
    <div style={styles.card}>
      <h2>Bitcoin Price</h2>
      <p>Price (USD): ${priceUsd ? priceUsd : "Loading..."}</p>
      <p>Price (EUR): €{priceEur ? priceEur : "Loading..."}</p>
      <p>24h Volume (USD): ${volumeUsd ? volumeUsd : "Loading..."}</p>
    </div>
  );
}

// BitcoinDominance Component
function BitcoinDominance() {
  const [btcDominance, setBtcDominance] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/bitcoin-dominance")
      .then((res) => res.json())
      .then((data) => setBtcDominance(data.btc_dominance));
  }, []);

  return (
    <div style={styles.card}>
      <h2>Bitcoin Dominance</h2>
      <p>{btcDominance ? `${btcDominance}%` : "Loading..."}</p>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={styles.footer}>
      <p>Bitcoin Explorer &copy; 2024</p>
    </footer>
  );
}

// Inline Styles for Simplicity
const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    color: "#333",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
    width: "100%",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "80%",
    maxWidth: "600px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    textAlign: "center",
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
};

export default App;
