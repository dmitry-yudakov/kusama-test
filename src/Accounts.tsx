import React, { useEffect, useState } from 'react';
import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
  // web3ListRpcProviders,
  // web3UseRpcProvider,
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// import { Balance } from '@polkadot/types/interfaces';

// const wsProvider = new WsProvider("wss://rpc.polkadot.io");
const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');

const initExtension = async () => {
  const injected = await web3Enable('Balance App');
  return { hasExtension: injected.length > 0 };
};

let _api: ApiPromise | null = null;
const getConn = async () => {
  if (!_api) {
    _api = await ApiPromise.create({ provider: wsProvider });
  }
  return _api;
};

// TODO proper type
const formatBalance = (balance: any) => {
  return (Number(balance) / 1000000000000).toFixed(4);
};

// TODO proper type
const getTokenSymbol = (registry: any) => {
  return registry?.chainTokens?.[0] || 'N/A';
};

const AccountInfo = ({ accountId }: { accountId: string }) => {
  const [accountInfo, setAccountInfo] = useState<any>();
  const isLoading = accountInfo === undefined;
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setError(undefined);
      try {
        const api = await getConn();
        const accountInfo: any = await api.query.system.account(accountId);
        console.log('Account info:', accountInfo);

        const { data: bal, registry } = accountInfo;
        console.log('BALANCE:', bal.free);
        console.log('token symbol:', getTokenSymbol(registry));

        setAccountInfo(accountInfo);
      } catch (e: any) {
        setError(e.message);
        setAccountInfo(null);
      }
    };
    fetchData();
  }, [accountId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !accountInfo) {
    return <div>Error: {error || 'Account not found'}</div>;
  }

  const { data: balance, registry } = accountInfo;

  return (
    <div>
      {accountId}
      {!!balance && (
        <div>
          Balance: {formatBalance(balance.free)} {getTokenSymbol(registry)}
        </div>
      )}
    </div>
  );
};

const AccountSelector: React.FC<{
  options: InjectedAccountWithMeta[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}> = ({ options, value, onChange }) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      <option value="">Select an account</option>
      {options.map((opt) => (
        <option key={opt.address} value={opt.address}>
          {opt.meta.name}
        </option>
      ))}
    </select>
  );
};

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>();
  const isLoading = accounts === undefined;
  const [error, setError] = useState<string>();
  const [selectedAccountId, setSelectedAccountId] = useState<string>();

  useEffect(() => {
    initExtension()
      .then(() => web3Accounts())
      .then(setAccounts)
      .catch((err) => {
        console.log('Error getting extension info', err);
        setError(err.message);
        setAccounts(null);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !accounts) {
    return <div>Error: {error || 'Accounts not found'}</div>;
  }

  return (
    <div>
      <h1>Extension Accounts</h1>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
      {!!accounts && (
        <AccountSelector
          options={accounts}
          value={selectedAccountId}
          onChange={setSelectedAccountId}
        />
      )}
      {!!selectedAccountId && <AccountInfo accountId={selectedAccountId} />}
    </div>
  );
};
export default Accounts;
