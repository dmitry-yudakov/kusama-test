import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
  // web3ListRpcProviders,
  // web3UseRpcProvider,
} from '@polkadot/extension-dapp';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';

const getNetworkEndpoint = (network: string) => {
  switch (network) {
    case 'kusama':
      return 'wss://kusama-rpc.polkadot.io';
    case 'westend':
    default:
      return 'wss://westend-rpc.polkadot.io';
  }
};
const getNetworkId = (network: string) => {
  switch (network) {
    case 'kusama':
      return 2;
    case 'westend':
      return 42;
    default:
      return 0;
  }
};

interface ContextProps {
  api?: ApiPromise;
  hasExtension?: boolean;
  isLoading: boolean;
  network: string;
}
const ContextProvider = React.createContext<ContextProps>({
  api: undefined,
  hasExtension: undefined,
  isLoading: true,
  network: 'westend',
});

export const NetworkContextProvider: FC<
  PropsWithChildren<{ network: string }>
> = ({ children, network }) => {
  const [state, setState] =
    useState<Pick<ContextProps, 'api' | 'hasExtension'>>();
  const isLoading = state === undefined;

  useEffect(() => {
    const initConnection = async () => {
      const injected = await web3Enable('Kusama Balance App');
      const hasExtension = injected.length > 0;

      const wsProvider = new WsProvider(getNetworkEndpoint(network));
      const api = await ApiPromise.create({ provider: wsProvider });

      setState({ api, hasExtension });
    };
    initConnection();
  }, [network]);

  const value = useMemo(
    () => ({
      api: state?.api || undefined,
      hasExtension: state?.hasExtension || undefined,
      isLoading,
      network,
    }),
    [state, isLoading, network]
  );

  return (
    <ContextProvider.Provider value={value}>
      {children}
    </ContextProvider.Provider>
  );
};

export const useNetwork = () => useContext(ContextProvider);

// TODO proper type
export const formatBalance = (balance: any) => {
  return (Number(balance) / 1000000000000).toFixed(4);
};

// TODO proper type
export const getTokenSymbol = (registry: any) => {
  return registry?.chainTokens?.[0] || 'N/A';
};

const keyring = new Keyring();

export const formatAddress = (address: string, network: string) => {
  return keyring.encodeAddress(address, getNetworkId(network));
};
