import axios from 'axios';
import { SpotifyTrack } from '../types';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

async function getAccessToken() {
  if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials');
  }

  const response = await axios.post(
    SPOTIFY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiration = Date.now() + (response.data.expires_in * 1000);
  return accessToken;
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  if (!query.trim()) return [];

  const token = await getAccessToken();
  
  const response = await axios.get(SPOTIFY_SEARCH_URL, {
    params: {
      q: query,
      type: 'track',
      limit: 3,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.tracks.items;
} 