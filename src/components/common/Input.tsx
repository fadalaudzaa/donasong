import styled from 'styled-components';

interface InputProps {
  error?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  padding: 0.75rem;
  border: ${({ theme, error }) => `3px solid ${error ? theme.colors.error : '#000'}`};
  border-radius: 8px;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.brutal};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.brutalHover};
    transform: translate(-2px, -2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #666;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

export const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorMessage = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
  min-height: 0.75rem; /* Reduced height */
  display: block;
  line-height: 1;
  margin-top: 0.125rem;
`; 