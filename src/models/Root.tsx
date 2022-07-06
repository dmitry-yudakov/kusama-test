import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getNetworkEndpoint } from '../blockchain-utils';

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
