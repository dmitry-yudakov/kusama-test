import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountSelector, AccountInfo } from '../components';
import { AccountsModel } from '../models/Accounts';

const AccountsPage: React.FC = () => {
  const { accounts, isLoading, error } = useMemo(
    () => AccountsModel.create(),
    []
  );
  const { selectedAccountId } = useParams();
  console.debug('AccountsPage', { accounts, isLoading, error });
  const navigate = useNavigate();

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
export default observer(AccountsPage);
