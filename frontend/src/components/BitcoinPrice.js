import React, { useEffect, useState } from 'react';
import { fetchBitcoinPrice } from '../api';

function BitcoinPrice() {
  const [priceData, setPriceData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBitcoinPrice();
      setPriceData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>Bitcoin Price (USD): ${priceData.price_usd}</div>
      <div>Bitcoin Price (EUR): €{priceData.price_eur}</div>
      <div>24-Hour Volume: ${priceData.volume_usd}</div>
    </div>
  );
}

export default BitcoinPrice;
