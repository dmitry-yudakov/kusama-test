import React from 'react';
import { AccountDescriptor } from '../models/Accounts';

export const AccountSelector: React.FC<{
  options: AccountDescriptor[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}> = ({ options, value, onChange }) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      <option value="">Select an account</option>
      {options.map((acc) => (
        <option key={acc.id} value={acc.id}>
          {acc.name}
        </option>
      ))}
    </select>
  );
};
