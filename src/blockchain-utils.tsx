import { Keyring } from '@polkadot/api';

export const getNetworkEndpoint = (network: string) => {
  switch (network) {
    case 'kusama':
      return 'wss://kusama-rpc.polkadot.io';
    case 'westend':
    default:
      return 'wss://westend-rpc.polkadot.io';
  }
};
export const getNetworkId = (network: string) => {
  switch (network) {
    case 'kusama':
      return 2;
    case 'westend':
      return 42;
    default:
      return 0;
  }
};

export const formatBalance = (balance: number) => {
  return (balance / 1000000000000).toFixed(4);
};

const keyring = new Keyring();

export const formatAddress = (address: string, network: string) => {
  return keyring.encodeAddress(address, getNetworkId(network));
};
