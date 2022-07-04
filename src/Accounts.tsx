import React, { useEffect, useState } from 'react';
import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
  // web3ListRpcProviders,
  // web3UseRpcProvider,
} from '@polkadot/extension-dapp';

const obtainExtensionInfo = async () => {
  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const injected = await web3Enable("my cool dapp 42");

  // returns an array of { address, meta: { name, source } }
  // meta.source contains the name of the extension that provides this account
  const accounts = await web3Accounts();
  return { injected, accounts };
};

const Accounts: React.FC = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    obtainExtensionInfo()
      .then((data) => setData(data))
      .catch((err) => {
        console.log("Error getting extension info", err);
      });
  }, []);
  return (
    <div>
      <h1>Extension Accounts</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default Accounts;
