export const NetworkSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="westend">Westend</option>
      <option value="kusama">Kusama</option>
    </select>
  );
};
