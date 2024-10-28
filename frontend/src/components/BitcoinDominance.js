import React, { useEffect, useState } from 'react';
import { fetchBitcoinDominance } from '../api';

function BitcoinDominance() {
  const [dominance, setDominance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBitcoinDominance();
      setDominance(data.btc_dominance);
    };

    fetchData();
  }, []);

  return <div>Bitcoin Dominance: {dominance}%</div>;
}

export default BitcoinDominance;
