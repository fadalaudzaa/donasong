import React from 'react';
import styled from 'styled-components';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  position: relative;
  margin-bottom: 4px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 22px;
  height: 22px;
  position: relative;
  margin: 0px;
  
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.checked ? props.theme.colors.primary : '#FFC29F'};
    border-radius: 0.125rem;
    border: 2px solid black;
    transition: background-color 0.2s;
  }

  &:hover::before {
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 8px;
    top: 4.5px;
    width: 6px;
    height: 10px;
    border-right: 3px solid black;
    border-bottom: 3px solid black;
    transform: rotate(45deg);
    opacity: ${props => props.checked ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
`;

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox 
        checked={checked} 
        onChange={onChange} 
      />
      <StyledCheckbox checked={checked} onClick={onChange} />
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
}; 