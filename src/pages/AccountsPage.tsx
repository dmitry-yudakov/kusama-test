import React, { useEffect, useState } from 'react';
import { web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountSelector, AccountInfo } from '../components';

const AccountsPage: React.FC = () => {
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
        <div className="panel">
          <AccountSelector
            options={accounts}
            value={selectedAccountId}
            onChange={(val) => navigate(val ? `/${val}` : '/')}
          />
        </div>
      )}
      {!!selectedAccountId && (
        <div className="paper">
          <AccountInfo accountId={selectedAccountId} />
        </div>
      )}
      {/* <pre>{JSON.stringify(accounts, null, 2)}</pre> */}
    </div>
  );
};
export default AccountsPage;
