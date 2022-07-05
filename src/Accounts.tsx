import React, { useEffect, useState } from 'react';
import { web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useNavigate, useParams } from 'react-router-dom';
import { formatBalance, getTokenSymbol, useNetwork } from './blockchain-utils';
// import { Balance } from '@polkadot/types/interfaces';

const AccountInfo = ({ accountId }: { accountId: string }) => {
  const [accountInfo, setAccountInfo] = useState<any>();
  const isLoading = accountInfo === undefined;
  const [error, setError] = useState<string>();

  const { api } = useNetwork();

  useEffect(() => {
    if (!api) return;

    const fetchData = async () => {
      setError(undefined);
      setAccountInfo(undefined);
      try {
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
  }, [accountId, api]);

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
  const { selectedAccountId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    web3Accounts()
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
      {!!accounts && (
        <AccountSelector
          options={accounts}
          value={selectedAccountId}
          onChange={(val) => navigate(val ? `/${val}` : '/')}
        />
      )}
      {!!selectedAccountId && <AccountInfo accountId={selectedAccountId} />}
      {/* <pre>{JSON.stringify(accounts, null, 2)}</pre> */}
    </div>
  );
};
export default Accounts;
