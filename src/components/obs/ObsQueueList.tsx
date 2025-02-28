import React from 'react';
import styled from 'styled-components';
import { QueueItem } from '../../types';
import { ObsQueueCard } from './ObsQueueCard';

const StyledQueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

interface ObsQueueListProps {
  songs: QueueItem[];
}

export const ObsQueueList: React.FC<ObsQueueListProps> = ({ songs }) => {
  return (
    <StyledQueueList>
      {songs.map((song: QueueItem) => (
        <ObsQueueCard key={song.id} song={song} />
      ))}
    </StyledQueueList>
  );
}; 