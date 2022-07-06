import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { formatAddress, formatBalance } from '../blockchain-utils';
import { AccountInfoModel } from '../models/Accounts';
import { useNetwork } from '../models/Root';

export const AccountInfo = observer(({ accountId }: { accountId: string }) => {
  const { api, network } = useNetwork();
  // I know...
  (window as any).api = api;

  const { balance, tokenSymbol, isLoading, error } = useMemo(
    () => AccountInfoModel.create({ id: accountId }),
    [accountId]
  );
  console.debug('AccountInfo', {
    accountId,
    balance,
    tokenSymbol,
    isLoading,
    error,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {formatAddress(accountId, network)}
      {balance !== undefined && (
        <div>
          Balance: <strong>{formatBalance(balance)}</strong> {tokenSymbol}
        </div>
      )}
    </div>
  );
});
