import { ApiPromise } from '@polkadot/api';
import { web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { applySnapshot, flow, Instance, types } from 'mobx-state-tree';

const AccountDescriptorModel = types.model({
  id: types.identifier,
  name: types.string,
});
export type AccountDescriptor = Instance<typeof AccountDescriptorModel>;

export const AccountsModel = types
  .model('Accounts', {
    accounts: types.array(AccountDescriptorModel),
    isLoading: false,
    error: types.maybe(types.string),
  })
  .actions((self) => ({
    afterCreate: flow(function* () {
      try {
        self.isLoading = true;
        const accounts: InjectedAccountWithMeta[] = yield web3Accounts();
        const modAccounts = accounts.map(({ address, meta }) => ({
          id: address,
          name: meta.name || address,
        }));
        applySnapshot(self.accounts, modAccounts);
      } catch (error: any) {
        self.error = error.message;
      }
      self.isLoading = false;
    }),
  }));

export const AccountInfoModel = types
  .model('AccountInfo', {
    id: types.identifier,
    balance: types.maybe(types.number),
    tokenSymbol: types.maybe(types.string),
    isLoading: false,
    error: types.maybe(types.string),
  })
  .actions((self) => ({
    afterCreate: flow(function* () {
      try {
        self.isLoading = true;
        const api = (window as any).api as ApiPromise;

        const accountInfo: any = yield api.query.system.account(self.id);
        console.debug('Account info:', accountInfo);
        if (!accountInfo) {
          throw new Error('Account not found');
        }

        const { data: balance, registry } = accountInfo;
        // console.log('BALANCE:', balance.free);
        // console.log('Token symbol:', getTokenSymbol(registry));

        self.balance = balance.free.toNumber();
        self.tokenSymbol = registry?.chainTokens?.[0] || 'N/A';
      } catch (error: any) {
        console.log('Error loading account info:', error);
        self.error = error.message;
      }
      self.isLoading = false;
    }),
  }));
