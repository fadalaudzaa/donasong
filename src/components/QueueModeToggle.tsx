import React from 'react';
import styled from 'styled-components';
import { useQueueMode } from '../lib/QueueModeContext';
import { ToggleSwitch } from './common/ToggleSwitch';
import { Checkbox } from './common/Checkbox';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  min-height: 2rem;
  width: 100%;
`;

const ToggleControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PriorityRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  height: ${props => props.hidden ? '0' : 'auto'};
  overflow: hidden;
  opacity: ${props => props.hidden ? '0' : '1'};
  transition: opacity 0.2s ease-in-out;
  margin-top: ${props => props.hidden ? '-0.75rem' : '0'};
`;

const ToggleLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.875rem;
  white-space: nowrap;
`;

const PriorityOptions = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-left: 0.5rem;
`;

const CheckboxWrapper = styled.div`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const QueueModeToggle: React.FC = () => {
  const { queueMode, toggleQueueMode, priorityHandling, setPriorityHandling } = useQueueMode();
  
  const handlePriorityChange = (value: 'skip' | 'wait') => {
    setPriorityHandling(value);
  };
  
  return (
    <ToggleContainer>
      <ToggleRow>
        <ToggleControls>
          <ToggleLabel>Queue Mode:</ToggleLabel>
          <ToggleSwitch 
            checked={queueMode === 'capitalist'} 
            onChange={toggleQueueMode}
            label={queueMode === 'capitalist' ? 'Capitalist' : 'First Come First Served'}
          />
        </ToggleControls>
      </ToggleRow>
      
      <PriorityRow hidden={queueMode !== 'capitalist'}>
        <ToggleLabel>Priority Handling:</ToggleLabel>
        <PriorityOptions>
          <CheckboxWrapper>
            <Checkbox 
              checked={priorityHandling === 'skip'} 
              onChange={() => handlePriorityChange('skip')}
              label="Skip to Priority"
            />
          </CheckboxWrapper>
          <CheckboxWrapper>
            <Checkbox 
              checked={priorityHandling === 'wait'} 
              onChange={() => handlePriorityChange('wait')}
              label="Wait for Current Song"
            />
          </CheckboxWrapper>
        </PriorityOptions>
      </PriorityRow>
    </ToggleContainer>
  );
}; 