import React, { useEffect, useState } from 'react';
import { fetchBlockHeight } from '../../api';

function BlockHeight() {
  const [blockHeight, setBlockHeight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBlockHeight();
      setBlockHeight(data.block_height);
    };

    fetchData();
  }, []);

  return <div>Latest Block Height: {blockHeight}</div>;
}

export default BlockHeight;
