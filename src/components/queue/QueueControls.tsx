import React from 'react';
import styled from 'styled-components';
import { QueueModeToggle } from '../QueueModeToggle';

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const QueueControls: React.FC = () => {
  return (
    <ControlsContainer>
      <QueueModeToggle />
    </ControlsContainer>
  );
}; 