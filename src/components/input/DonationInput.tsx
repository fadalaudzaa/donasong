import React from 'react';
import { Input, InputGroup, Label, ErrorMessage } from '../common/Input';
import { formatDonationInput } from '../../utils/formatters';

interface DonationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DonationInput: React.FC<DonationInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDonationInput(e.target.value);
    onChange(formattedValue);
  };

  return (
    <InputGroup>
      <Label>Donation Amount (IDR)</Label>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="e.g. 50,000"
        error={!!error}
      />
      <ErrorMessage>{error || ' '}</ErrorMessage>
    </InputGroup>
  );
}; 