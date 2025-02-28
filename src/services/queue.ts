import { supabase } from '../lib/supabase';
import { Song, QueueItem } from '../types';
import { playPriorityNotification } from '../utils/sound';
import toast from 'react-hot-toast';
import { formatIDR } from '../utils/formatters';

// get the current queue mode from localStorage
const getQueueMode = (): 'capitalist' | 'fifo' => {
  const savedMode = localStorage.getItem('queueMode');
  return (savedMode as 'capitalist' | 'fifo') || 'capitalist';
};

// get the priority handling from localStorage
const getPriorityHandling = (): 'skip' | 'wait' => {
  const savedHandling = localStorage.getItem('priorityHandling');
  return (savedHandling as 'skip' | 'wait') || 'wait';
};

export async function addSongToQueue(song: Omit<Song, 'id' | 'timestamp'>) {
  const queueMode = getQueueMode();

  // only check for priority donation in capitalist mode
  let isPriorityDonation = false;
  if (queueMode === 'capitalist') {
    const { data: currentTopSong } = await supabase
      .from('songs')
      .select('donation_amount')
      .order('donation_amount', { ascending: false })
      .limit(1)
      .single();

    isPriorityDonation = !!(currentTopSong && song.donationAmount > currentTopSong.donation_amount);
  }

  // match supabase column names
  const supabaseData = {
    title: song.title,
    artist: song.artist,
    cover_art: song.coverArt,
    donation_amount: song.donationAmount,
    spotify_id: song.spotifyId,
    timestamp: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('songs')
    .insert([supabaseData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // play notification based on queue mode 
  if (queueMode === 'capitalist') {
    // in capitalist mode, only play for priority donations
    if (isPriorityDonation) {
      playPriorityNotification();
      toast.success(
        `⚡ New Priority Song! ${song.title} just topped the queue with ${formatIDR(song.donationAmount)}`,
        {
          duration: 5000,
          icon: '🎵'
        }
      );
    } else {
      toast.success('Song added to queue!');
    }
  } else {
    // in FIFO mode, always play notification
    playPriorityNotification();
    toast.success('Song added to queue!');
  }

  return data;
}

export async function getQueue(): Promise<QueueItem[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('timestamp', { ascending: true });

  if (error) throw error;

  return data.map((song, index) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    coverArt: song.cover_art,
    donationAmount: song.donation_amount,
    spotifyId: song.spotify_id,
    timestamp: song.timestamp,
    isPlaying: index === 0,
  }));
}

export async function getQueueCapitalistSort(): Promise<QueueItem[]> {
  const priorityHandling = getPriorityHandling();
  
  // if priority handling is on 'wait', it ONLY keeps the current song in place
  // and sort the rest by donation amount
  if (priorityHandling === 'wait') {
    // get the time-based queue first to identify the current song
    const { data: timeBasedQueue, error: timeError } = await supabase
      .from('songs')
      .select('*')
      .order('timestamp', { ascending: true });
      
    if (timeError) throw timeError;
    
    if (!timeBasedQueue.length) return [];
    
    const currentSong = timeBasedQueue[0];
    
    const { data: restOfQueue, error: restError } = await supabase
      .from('songs')
      .select('*')
      .neq('id', currentSong.id) // 
      .order('donation_amount', { ascending: false }) // sort by donation amount
      .order('timestamp', { ascending: true }); // secondary sort by time
      
    if (restError) throw restError;
    
    // combine the current song with the rest of the queue sorted by donation
    const combinedQueue = [
      currentSong,
      ...restOfQueue
    ];
    
    return combinedQueue.map((song, index) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverArt: song.cover_art,
      donationAmount: song.donation_amount,
      spotifyId: song.spotify_id,
      timestamp: song.timestamp,
      isPlaying: index === 0,
    }));
  } else {
    // standard capitalist sort (by donation amount)
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('donation_amount', { ascending: false })
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map((song, index) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverArt: song.cover_art,
      donationAmount: song.donation_amount,
      spotifyId: song.spotify_id,
      timestamp: song.timestamp,
      isPlaying: index === 0,
    }));
  }
}

export async function removeSong(id: string) {
  const { error } = await supabase
    .from('songs')
    .delete()
    .match({ id });

  if (error) throw error;
}

export function subscribeToQueue(callback: (queue: QueueItem[]) => void) {
  const subscription = supabase
    .channel('queue_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'songs',
      },
      async (payload) => {
        try {
          const queueMode = getQueueMode();
          
          // check for priority donation only in capitalist mode
          if (queueMode === 'capitalist' && payload.eventType === 'INSERT') {
            const newSong = payload.new;
            const { data: previousTopSong } = await supabase
              .from('songs')
              .select('donation_amount')
              .neq('id', newSong.id) // Exclude the new song
              .order('donation_amount', { ascending: false })
              .limit(1)
              .single();

            // play sound if priority donation in capitalist mode
            if (previousTopSong && newSong.donation_amount > previousTopSong.donation_amount) {
              playPriorityNotification();
            }
          }

          // real-time updates
          const queue = await getQueue();
          callback(queue);
        } catch (error) {
          console.error('Error fetching updated queue:', error);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export async function clearQueue() {
  const { error } = await supabase
    .from('songs')
    .delete()
    .not('id', 'is', null); // delete all records with non-null IDs

  if (error) throw error;

  toast.success('Queue cleared successfully');
} 