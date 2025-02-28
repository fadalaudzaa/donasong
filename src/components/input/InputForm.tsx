import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../common/Button';
import { SongSearch } from './SongSearch';
import { ArtistInput } from './ArtistInput';
import { DonationInput } from './DonationInput';
import { addSongToQueue } from '../../services/queue';
import { SpotifyTrack } from '../../types';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const DEFAULT_COVER_ART = 'https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
`;

interface InputFormProps {
  onNavigateToQueue: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onNavigateToQueue }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
  const [manualArtist, setManualArtist] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const { errors, setError, clearError } = useErrorHandler();

  const addSongMutation = useMutation({
    mutationFn: addSongToQueue,
    onSuccess: () => {
      setSearchQuery('');
      setSelectedSong(null);
      setManualArtist('');
      setDonationAmount('');
      setError('song', '');
      setError('donation', '');
      toast.success('Song added to queue');
    },
    onError: () => {
      toast.error('Failed to add song to queue');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!selectedSong && !searchQuery) {
      setError('song', 'Please select or enter a song');
      isValid = false;
    }
    
    if (!donationAmount) {
      setError('donation', 'Please enter a donation amount');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const amount = Number(donationAmount.replace(/[^0-9]/g, ''));
    
    addSongMutation.mutate({
      title: selectedSong ? selectedSong.name : searchQuery,
      artist: selectedSong ? selectedSong.artists[0].name : (manualArtist || 'Unknown Artist'),
      coverArt: selectedSong ? selectedSong.album.images[0].url : DEFAULT_COVER_ART,
      donationAmount: amount,
      spotifyId: selectedSong?.id,
    });
  };

  const handleSongSelect = (track: SpotifyTrack) => {
    setSelectedSong(track);
    setSearchQuery(track.name);
    setManualArtist(track.artists[0].name);
    clearError('song');
  };

  const handleManualAdd = () => {
    setSelectedSong(null);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    if (selectedSong) {
      setSelectedSong(null);
    }
    
    // clear song error when text is entered
    if (query) {
      clearError('song');
    }
  };

  const handleDonationChange = (value: string) => {
    setDonationAmount(value);
    
    // clear donation error when text is entered
    if (value) {
      clearError('donation');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <SongSearch
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        onSongSelect={handleSongSelect}
        onManualAdd={handleManualAdd}
        error={errors.song}
      />

      <ArtistInput
        value={manualArtist}
        onChange={setManualArtist}
        disabled={!!selectedSong}
      />

      <DonationInput
        value={donationAmount}
        onChange={handleDonationChange}
        error={errors.donation}
      />

      <ButtonContainer>
        <Button
          type="button"
          variant="primary"
          onClick={onNavigateToQueue}
        >
          View Queue
        </Button>
        <Button
          type="submit"
          variant="secondary"
          disabled={addSongMutation.isPending}
        >
          {addSongMutation.isPending ? 'Adding...' : 'Add to Queue'}
        </Button>
      </ButtonContainer>
    </Form>
  );
}; 