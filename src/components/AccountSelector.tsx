import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export const AccountSelector: React.FC<{
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
