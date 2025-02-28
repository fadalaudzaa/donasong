import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Input, InputGroup, Label, ErrorMessage } from '../components/Input';
import { Button } from '../components/Button';
import { searchTracks } from '../services/spotify';
import { addSongToQueue } from '../services/queue';
import { SpotifyTrack } from '../types';
import { formatDonationInput } from '../utils/formatters';

const DEFAULT_COVER_ART = 'https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 75%;
  left: 0;
  right: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: ${({ theme }) => theme.borders.brutal};
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ManualAddItem = styled(SuggestionItem)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export default function InputPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SpotifyTrack[]>([]);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
  const [manualArtist, setManualArtist] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Donasong Request';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim() && !selectedSong) {
        try {
          const tracks = await searchTracks(searchQuery);
          setSuggestions(tracks);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error searching tracks:', error);
          toast.error('Failed to search for songs');
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, selectedSong]);

  const addSongMutation = useMutation({
    mutationFn: addSongToQueue,
    onSuccess: () => {
      setSearchQuery('');
      setSelectedSong(null);
      setManualArtist('');
      setDonationAmount('');
      setErrors({});
    },
    onError: () => {
      toast.error('Failed to add song to queue');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedSong && !searchQuery) {
      newErrors.song = 'Please select or enter a song';
    }
    if (!donationAmount) {
      newErrors.donation = 'Please enter a donation amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    setShowSuggestions(false);
    
    // clear song error
    if (errors.song) {
      const updatedErrors = { ...errors };
      delete updatedErrors.song;
      setErrors(updatedErrors);
    }
  };

  const handleManualAdd = () => {
    setSelectedSong(null);
    setShowSuggestions(false);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Donasong Request</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        <SearchContainer>
          <InputGroup style={{ marginBottom: 0 }}>
            <Label>Song Title</Label>
            <InputWrapper>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedSong) {
                    setSelectedSong(null);
                  }
                  
                  // clear song error when text is entered
                  if (e.target.value && errors.song) {
                    const updatedErrors = { ...errors };
                    delete updatedErrors.song;
                    setErrors(updatedErrors);
                  }
                }}
                placeholder="Search for a song..."
                error={!!errors.song}
              />
            </InputWrapper>
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionList>
                {suggestions.map((track) => (
                  <SuggestionItem
                    key={track.id}
                    onClick={() => handleSongSelect(track)}
                  >
                    {track.name} - {track.artists[0].name}
                  </SuggestionItem>
                ))}
                <ManualAddItem onClick={handleManualAdd}>
                  + Add manually
                </ManualAddItem>
              </SuggestionList>
            )}
            <ErrorMessage>{errors.song || ' '}</ErrorMessage>
          </InputGroup>
        </SearchContainer>

        <InputGroup>
          <Label>Artist Name</Label>
          <Input
            type="text"
            value={selectedSong ? selectedSong.artists[0].name : manualArtist}
            onChange={(e) => setManualArtist(e.target.value)}
            placeholder="Enter artist name..."
            error={!!errors.artist}
            disabled={!!selectedSong}
          />
          <ErrorMessage>{errors.artist || ' '}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Donation Amount</Label>
          <Input
            type="text"
            value={donationAmount}
            onChange={(e) => {
              const formattedValue = formatDonationInput(e.target.value);
              setDonationAmount(formattedValue);
              
              // clear donation error when text is entered
              if (formattedValue && errors.donation) {
                const updatedErrors = { ...errors };
                delete updatedErrors.donation;
                setErrors(updatedErrors);
              }
            }}
            placeholder="Enter donation amount..."
            error={!!errors.donation}
          />
          <ErrorMessage>{errors.donation || ' '}</ErrorMessage>
        </InputGroup>

        <ButtonContainer>
          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={() => navigate('/queue')}
          >
            View Queue
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="large"
            disabled={addSongMutation.isPending}
          >
            {addSongMutation.isPending ? 'Adding...' : 'Add to Queue'}
          </Button>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );
} 