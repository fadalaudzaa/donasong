import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: white;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

interface ObsHeaderProps {
  title: string;
}

export const ObsHeader: React.FC<ObsHeaderProps> = ({ title }) => {
  return <Title>{title}</Title>;
}; 