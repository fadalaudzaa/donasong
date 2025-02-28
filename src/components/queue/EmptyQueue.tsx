import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  border: ${({ theme }) => theme.borders.brutal};
  border-radius: 8px;
  background-color: white;
`;

const EmptyStateText = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

interface EmptyQueueProps {
  onRequestSong: () => void;
}

export const EmptyQueue: React.FC<EmptyQueueProps> = ({ onRequestSong }) => {
  return (
    <EmptyState>
      <EmptyStateText>No songs in the queue</EmptyStateText>
      <Button
        variant="primary"
        size="large"
        onClick={onRequestSong}
      >
        Request a Song
      </Button>
    </EmptyState>
  );
}; 