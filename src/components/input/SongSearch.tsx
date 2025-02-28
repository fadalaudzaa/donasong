import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input, InputGroup, Label, ErrorMessage } from '../common/Input';
import { searchTracks } from '../../services/spotify';
import { SpotifyTrack } from '../../types';

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

interface SongSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSongSelect: (track: SpotifyTrack) => void;
  onManualAdd: () => void;
  error?: string;
}

export const SongSearch: React.FC<SongSearchProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSongSelect,
  onManualAdd,
  error,
}) => {
  const [suggestions, setSuggestions] = useState<SpotifyTrack[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const tracks = await searchTracks(searchQuery);
          setSuggestions(tracks);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error searching tracks:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  return (
    <SearchContainer>
      <InputGroup style={{ marginBottom: 0 }}>
        <Label>Song Title</Label>
        <InputWrapper>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search for a song..."
            error={!!error}
          />
        </InputWrapper>
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionList>
            {suggestions.map((track) => (
              <SuggestionItem
                key={track.id}
                onClick={() => {
                  onSongSelect(track);
                  setShowSuggestions(false);
                }}
              >
                {track.name} - {track.artists[0].name}
              </SuggestionItem>
            ))}
            <ManualAddItem onClick={() => {
              onManualAdd();
              setShowSuggestions(false);
            }}>
              + Add manually
            </ManualAddItem>
          </SuggestionList>
        )}
        <ErrorMessage>{error || ' '}</ErrorMessage>
      </InputGroup>
    </SearchContainer>
  );
}; 