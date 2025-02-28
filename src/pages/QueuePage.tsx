import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQueueData } from '../hooks/useQueueData';
import { QueueHeader } from '../components/queue/QueueHeader';
import { QueueControls } from '../components/queue/QueueControls';
import { QueueList } from '../components/queue/QueueList';
import { EmptyQueue } from '../components/queue/EmptyQueue';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export default function QueuePage() {
  const navigate = useNavigate();
  const { displayedQueue, isLoading, handleRemove, handleClearQueue, isEmpty } = useQueueData();
  
  // Update document title
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Donasong List';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <QueueHeader 
          hasItems={false}
          onNavigateToAdd={() => navigate('/')}
          onClearQueue={handleClearQueue}
        />
        <p>Loading queue...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <QueueHeader 
        hasItems={!isEmpty}
        onNavigateToAdd={() => navigate('/')}
        onClearQueue={handleClearQueue}
      />

      <QueueControls />

      {isEmpty ? (
        <EmptyQueue onRequestSong={() => navigate('/')} />
      ) : (
        <QueueList songs={displayedQueue} onRemove={handleRemove} />
      )}
    </PageContainer>
  );
}