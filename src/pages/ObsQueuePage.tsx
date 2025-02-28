import { useEffect } from 'react';
import styled from 'styled-components';
import { useQueueData } from '../hooks/useQueueData';
import { ObsHeader } from '../components/obs/ObsHeader';
import { ObsQueueList } from '../components/obs/ObsQueueList';
import { ObsEmptyQueue } from '../components/obs/ObsEmptyQueue';

// transparent components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: transparent;
`;

export default function ObsQueuePage() {
  const { displayedQueue, isLoading, isEmpty } = useQueueData();
  
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

  if (isLoading) {
    return (
      <PageContainer>
        <ObsHeader title="Loading..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ObsHeader title="Donasong List" />
      
      {isEmpty ? (
        <ObsEmptyQueue />
      ) : (
        <ObsQueueList songs={displayedQueue} />
      )}
    </PageContainer>
  );
} 