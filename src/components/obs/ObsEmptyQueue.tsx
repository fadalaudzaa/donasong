import React from 'react';
import styled from 'styled-components';

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.75);
  border: ${({ theme }) => theme.borders.brutal};
  border-radius: 8px;
  backdrop-filter: blur(5px);
`;

const EmptyStateText = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  margin: 0;
  color: #333;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
`;

export const ObsEmptyQueue: React.FC = () => {
  return (
    <EmptyState>
      <EmptyStateText>No songs in the queue</EmptyStateText>
    </EmptyState>
  );
}; 