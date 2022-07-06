import { useEffect, useState } from 'react';
import {
  formatAddress,
  formatBalance,
  getTokenSymbol,
  useNetwork,
} from '../blockchain-utils';
// import { Balance } from '@polkadot/types/interfaces';

export const AccountInfo = ({ accountId }: { accountId: string }) => {
  const [accountInfo, setAccountInfo] = useState<any>();
  const isLoading = accountInfo === undefined;
  const [error, setError] = useState<string>();

  const { api, network } = useNetwork();

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
      {formatAddress(accountId, network)}
      {!!balance && (
        <div>
          Balance: <strong>{formatBalance(balance.free)}</strong>{' '}
          {getTokenSymbol(registry)}
        </div>
      )}
    </div>
  );
};
