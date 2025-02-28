import React from 'react';
import styled from 'styled-components';
import { QueueItem } from '../../types';
import { formatIDR } from '../../utils/formatters';

const Card = styled.div<{ isPlaying: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ isPlaying }) => 
    isPlaying 
      ? 'rgba(255, 230, 109, 0.85)' 
      : 'rgba(255, 255, 255, 0.75)'};
  border: ${({ theme }) => theme.borders.brutal};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.brutal};
  backdrop-filter: blur(5px);
  transition: all 0.2s ease-in-out;
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
  color: #000;
`;

const Artist = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
  color: #333;
`;

const DonationAmount = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
`;

interface ObsQueueCardProps {
  song: QueueItem;
}

export const ObsQueueCard: React.FC<ObsQueueCardProps> = ({ song }) => {
  return (
    <Card isPlaying={song.isPlaying}>
      <CoverArt src={song.coverArt} alt={`${song.title} cover art`} />
      <SongInfo>
        <Title>{song.title}</Title>
        <Artist>{song.artist}</Artist>
      </SongInfo>
      <DonationAmount>{formatIDR(song.donationAmount)}</DonationAmount>
    </Card>
  );
}; 