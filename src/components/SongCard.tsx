import React from 'react';
import styled from 'styled-components';
import { QueueItem } from '../types';
import { Button } from './Button';
import { formatIDR } from '../utils/formatters';

interface SongCardProps {
  song: QueueItem;
  onRemove: (id: string) => void;
}

const Card = styled.div<{ isPlaying: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme, isPlaying }) =>
    isPlaying ? theme.colors.accent : 'white'};
  border: ${({ theme }) => theme.borders.brutal};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.brutal};
  transition: all 0.2s ease-in-out;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.brutalHover};
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }
`;

const CoverArt = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: ${({ theme }) => theme.borders.brutal};
  border-radius: 4px;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.125rem;
  margin: 0;
`;

const Artist = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
`;

const DonationAmount = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const RemoveButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 4px;

  ${Card}:hover & {
    opacity: 1;
  }
`;

export const SongCard: React.FC<SongCardProps> = ({ song, onRemove }) => {
  return (
    <Card isPlaying={song.isPlaying}>
      <CoverArt src={song.coverArt} alt={`${song.title} cover art`} />
      <SongInfo>
        <Title>{song.title}</Title>
        <Artist>{song.artist}</Artist>
      </SongInfo>
      <DonationAmount>{formatIDR(song.donationAmount)}</DonationAmount>
      <RemoveButton
        variant="danger"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(song.id);
        }}
      >
        Remove
      </RemoveButton>
    </Card>
  );
}; 