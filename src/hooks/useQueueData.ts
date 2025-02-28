import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getQueue, removeSong, clearQueue, getQueueCapitalistSort } from '../services/queue';
import { QueueItem } from '../types';
import { useQueueMode } from '../lib/QueueModeContext';
import { useQueueSubscription } from './useQueueSubscription';
import { queryKeys } from './useQueryConfig';
import { useErrorHandler } from './useErrorHandler';

export const useQueueData = () => {
  const queryClient = useQueryClient();
  const { queueMode } = useQueueMode();
  const [displayedQueue, setDisplayedQueue] = useState<QueueItem[]>([]);
  const { handleApiError } = useErrorHandler();
  
  // queue subscription
  useQueueSubscription();

  // to invalidate both queue queries
  const invalidateQueueQueries = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.queue.timeSort });
    queryClient.invalidateQueries({ queryKey: queryKeys.queue.donationSort });
  };

  // fcfs
  const { data: timeBasedQueue = [], isLoading: isLoadingTimeQueue } = useQuery({
    queryKey: queryKeys.queue.timeSort,
    queryFn: getQueue,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // capitalist fetch
  const { data: donationBasedQueue = [], isLoading: isLoadingDonationQueue } = useQuery({
    queryKey: queryKeys.queue.donationSort,
    queryFn: getQueueCapitalistSort,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: queueMode === 'capitalist', // only fetch if in capitalist mode
  });

  // display queue based on queue mode
  useEffect(() => {
    if (queueMode === 'capitalist') {
      setDisplayedQueue(donationBasedQueue as QueueItem[]);
    } else {
      setDisplayedQueue(timeBasedQueue as QueueItem[]);
    }
  }, [timeBasedQueue, donationBasedQueue, queueMode]);

  // remove mutation
  const removeMutation = useMutation({
    mutationFn: removeSong,
    onSuccess: () => {
      invalidateQueueQueries();
      toast.success('Song removed from queue');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to remove song');
    },
  });

  // clear mutation
  const clearMutation = useMutation({
    mutationFn: clearQueue,
    onSuccess: () => {
      invalidateQueueQueries();
      toast.success('Queue cleared');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to clear queue');
    },
  });

  // remove song handler
  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this song?')) {
      removeMutation.mutate(id);
    }
  };

  // clear queue handler
  const handleClearQueue = () => {
    if (window.confirm('Are you sure you want to clear the entire queue? This action cannot be undone.')) {
      clearMutation.mutate();
    }
  };

  const isLoading = isLoadingTimeQueue || (queueMode === 'capitalist' && isLoadingDonationQueue);

  return {
    displayedQueue,
    isLoading,
    handleRemove,
    handleClearQueue,
    isEmpty: displayedQueue.length === 0,
  };
};