const API_BASE_URL = 'http://localhost:5000/api';

export const fetchBlockHeight = async () => {
  const response = await fetch(`${API_BASE_URL}/block-height`);
  return response.json();
};

export const fetchTransactionCount = async () => {
  const response = await fetch(`${API_BASE_URL}/transaction-count`);
  return response.json();
};

export const fetchBitcoinPrice = async () => {
  const response = await fetch(`${API_BASE_URL}/bitcoin-price`);
  return response.json();
};

export const fetchBitcoinDominance = async () => {
  const response = await fetch(`${API_BASE_URL}/bitcoin-dominance`);
  return response.json();
};
