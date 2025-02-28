import { useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getQueue, getQueueCapitalistSort } from '../services/queue';
import { useQueueMode } from '../lib/QueueModeContext';
import { QueueItem } from '../types';
import { formatIDR } from '../utils/formatters';
import { useQueueSubscription } from '../hooks/useQueueSubscription';

// transparent components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: transparent;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: white;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

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

const Title2 = styled.h3`
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

export default function ObsQueuePage() {
  const { queueMode, priorityHandling } = useQueueMode();
  
  useQueueSubscription();

  // set transparent background
  useEffect(() => {
    document.body.style.background = 'transparent';
    const originalTitle = document.title;
    document.title = 'Donasong OBS';
    
    return () => {
      // restore original background when unmounting
      document.body.style.background = '';
      document.title = originalTitle;
    };
  }, []);

  const { data: timeBasedQueue = [], isLoading: isLoadingTimeQueue } = useQuery({
    queryKey: ['queue', 'time'],
    queryFn: getQueue,
    refetchOnWindowFocus: true,
  });

  const { data: donationBasedQueue = [], isLoading: isLoadingDonationQueue } = useQuery({
    queryKey: ['queue', 'donation'],
    queryFn: getQueueCapitalistSort,
    refetchOnWindowFocus: true,
    enabled: queueMode === 'capitalist', // only fetch if in capitalist mode
  });

  const displayQueue = () => {
    if (queueMode === 'capitalist' && priorityHandling === 'skip') {
      return donationBasedQueue;
    }
    return timeBasedQueue;
  };

  const queue = displayQueue();
  const isLoading = isLoadingTimeQueue || (queueMode === 'capitalist' && isLoadingDonationQueue);

  if (isLoading) {
    return (
      <PageContainer>
        <Title>Loading...</Title>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>Donasong List</Title>
      
      {queue.length === 0 ? (
        <EmptyState>
          <EmptyStateText>No songs in the queue</EmptyStateText>
        </EmptyState>
      ) : (
        <QueueList>
          {queue.map((song: QueueItem) => (
            <Card key={song.id} isPlaying={song.isPlaying}>
              <CoverArt src={song.coverArt} alt={`${song.title} cover art`} />
              <SongInfo>
                <Title2>{song.title}</Title2>
                <Artist>{song.artist}</Artist>
              </SongInfo>
              <DonationAmount>{formatIDR(song.donationAmount)}</DonationAmount>
            </Card>
          ))}
        </QueueList>
      )}
    </PageContainer>
  );
} 