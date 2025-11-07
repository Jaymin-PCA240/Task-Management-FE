import { TextField } from '@mui/material';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({ label, name, type = 'text', value, onChange }: InputFieldProps) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={type}
    variant="outlined"
    className="mb-4"
    value={value}
    onChange={onChange}
  />
);
