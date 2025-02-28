import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
    text-align: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: stretch;
    
    > button {
      flex: 1;
    }
  }
`;

interface QueueHeaderProps {
  hasItems: boolean;
  onNavigateToAdd: () => void;
  onClearQueue: () => void;
}

export const QueueHeader: React.FC<QueueHeaderProps> = ({
  hasItems,
  onNavigateToAdd,
  onClearQueue,
}) => {
  return (
    <Header>
      <Title>Donasong List</Title>
      <ButtonGroup>
        <Button
          variant="secondary"
          size="large"
          onClick={onNavigateToAdd}
        >
          Add Song
        </Button>
        {hasItems && (
          <Button
            variant="danger"
            size="large"
            onClick={onClearQueue}
          >
            Clear Queue
          </Button>
        )}
      </ButtonGroup>
    </Header>
  );
}; 