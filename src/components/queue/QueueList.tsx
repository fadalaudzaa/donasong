import React from 'react';
import styled from 'styled-components';
import { SongCard } from '../SongCard';
import { QueueItem } from '../../types';

const StyledQueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface QueueListProps {
  songs: QueueItem[];
  onRemove: (id: string) => void;
}

export const QueueList: React.FC<QueueListProps> = ({ songs, onRemove }) => {
  return (
    <StyledQueueList>
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          onRemove={onRemove}
        />
      ))}
    </StyledQueueList>
  );
}; 