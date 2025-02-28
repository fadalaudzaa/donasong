import React from 'react';
import { Input, InputGroup, Label } from '../common/Input';

interface ArtistInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ArtistInput: React.FC<ArtistInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <InputGroup>
      <Label>Artist Name</Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Artist name"
        disabled={disabled}
      />
    </InputGroup>
  );
}; 