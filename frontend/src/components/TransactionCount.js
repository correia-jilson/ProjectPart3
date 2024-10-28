import React, { useEffect, useState } from 'react';
import { fetchTransactionCount } from '../api';

function TransactionCount() {
  const [transactionCount, setTransactionCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransactionCount();
      setTransactionCount(data.transaction_count);
    };

    fetchData();
  }, []);

  return <div>Transaction Count: {transactionCount}</div>;
}

export default TransactionCount;
