import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getQueue, removeSong, clearQueue, getQueueCapitalistSort } from '../services/queue';
import { SongCard } from '../components/SongCard';
import { Button } from '../components/Button';
import { QueueModeToggle } from '../components/QueueModeToggle';
import { useQueueMode } from '../lib/QueueModeContext';
import { QueueItem } from '../types';
import { useQueueSubscription } from '../hooks/useQueueSubscription';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

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

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

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

export default function QueuePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { queueMode } = useQueueMode();
  const [displayedQueue, setDisplayedQueue] = useState<QueueItem[]>([]);
  
  useQueueSubscription();

  // docs title
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Donasong List';
    return () => {
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

  // update displayed queue based on queue mode and priority handling
  useEffect(() => {
    if (queueMode === 'capitalist') {
      setDisplayedQueue(donationBasedQueue);
    } else {
      setDisplayedQueue(timeBasedQueue);
    }
  }, [timeBasedQueue, donationBasedQueue, queueMode]);

  const removeMutation = useMutation({
    mutationFn: removeSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', 'time'] });
      queryClient.invalidateQueries({ queryKey: ['queue', 'donation'] });
      toast.success('Song removed from queue');
    },
    onError: () => {
      toast.error('Failed to remove song');
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', 'time'] });
      queryClient.invalidateQueries({ queryKey: ['queue', 'donation'] });
    },
    onError: () => {
      toast.error('Failed to clear queue');
    },
  });

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this song?')) {
      removeMutation.mutate(id);
    }
  };

  const handleClearQueue = () => {
    if (window.confirm('Are you sure you want to clear the entire queue? This action cannot be undone.')) {
      clearMutation.mutate();
    }
  };

  const isLoading = isLoadingTimeQueue || (queueMode === 'capitalist' && isLoadingDonationQueue);

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <Title>Loading queue...</Title>
        </Header>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Donasong List</Title>
        <ButtonGroup>
          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate('/')}
          >
            Add Song
          </Button>
          {displayedQueue.length > 0 && (
            <Button
              variant="danger"
              size="large"
              onClick={handleClearQueue}
            >
              Clear Queue
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <ControlsContainer>
        <QueueModeToggle />
      </ControlsContainer>

      {displayedQueue.length === 0 ? (
        <EmptyState>
          <EmptyStateText>No songs in the queue</EmptyStateText>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Request a Song
          </Button>
        </EmptyState>
      ) : (
        <QueueList>
          {displayedQueue.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onRemove={handleRemove}
            />
          ))}
        </QueueList>
      )}
    </PageContainer>
  );
}