export interface Song {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  donationAmount: number;
  timestamp: string;
  spotifyId?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

export interface QueueItem extends Song {
  isPlaying: boolean;
} 