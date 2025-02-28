import React from 'react';
import styled from 'styled-components';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Switch = styled.div`
  position: relative;
  width: 46px;
  height: 25px;
  display: inline-block;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const Slider = styled.span<{ isOn: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.isOn ? props.theme.colors.primary : '#9CA3AF'};
  transition: 0.2s;
  border-radius: 34px;
  border: 2px solid black;
  box-shadow: ${props => props.isOn ? '2px 2px 0px rgba(0, 0, 0, 1)' : 'none'};

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
    border: 2px solid black;
    transform: ${props => props.isOn ? 'translateX(20px)' : 'translateX(0)'};
  }
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <Container>
      <Switch onClick={onChange}>
        <Input type="checkbox" checked={checked} onChange={onChange} />
        <Slider isOn={checked} />
      </Switch>
      {label && <Label>{label}</Label>}
    </Container>
  );
}; 