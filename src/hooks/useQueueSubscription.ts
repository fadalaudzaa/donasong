import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToQueue } from '../services/queue';
import { useQueueMode } from '../lib/QueueModeContext';
import { queryKeys } from './useQueryConfig';

// to avoid duplicate code in QueuePage and ObsQueuePage lolzzz 
export const useQueueSubscription = () => {
  const queryClient = useQueryClient();
  const { queueMode } = useQueueMode();

  useEffect(() => {
    const unsubscribe = subscribeToQueue((updatedQueue) => {
      // update time-based queue
      queryClient.setQueryData(queryKeys.queue.timeSort, updatedQueue);
      
      // re-fetch donation-based queue when queue changes
      if (queueMode === 'capitalist') {
        queryClient.invalidateQueries({ queryKey: queryKeys.queue.donationSort });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, queueMode]);

  return null;
}; 