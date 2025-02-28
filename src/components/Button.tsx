import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'compact';
}

export const Button = styled.button<ButtonProps>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  border: ${({ theme, size }) => size === 'compact' ? '2px solid black' : theme.borders.brutal};
  border-radius: 8px;
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
  padding: ${({ size }) => {
    switch (size) {
      case 'small':
        return '0.25rem 0.5rem';
      case 'compact':
        return '0.2rem 0.4rem';
      case 'large':
        return '0.75rem 1.5rem';
      default:
        return '0.5rem 1rem';
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
      case 'compact':
        return '0.875rem';
      case 'large':
        return '1.25rem';
      default:
        return '1rem';
    }
  }};
  box-shadow: ${({ theme, size }) => size === 'compact' ? '2px 2px 0px rgba(0, 0, 0, 1)' : theme.shadows.brutal};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${({ size }) => size === 'compact' ? 'translate(-2px, -2px)' : 'translate(-2px, -2px)'};
    box-shadow: ${({ theme, size }) => size === 'compact' ? '4px 4px 0px rgba(0, 0, 0, 1)' : theme.shadows.brutalHover};
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: ${({ theme, size }) => size === 'compact' ? '1px 1px 0px rgba(0, 0, 0, 1)' : theme.shadows.brutal};
    }
  }
`; 