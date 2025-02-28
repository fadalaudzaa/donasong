import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type QueueMode = 'capitalist' | 'fifo';
type PriorityHandling = 'skip' | 'wait';

interface QueueModeContextType {
  queueMode: QueueMode;
  priorityHandling: PriorityHandling;
  setQueueMode: (mode: QueueMode) => void;
  setPriorityHandling: (handling: PriorityHandling) => void;
  toggleQueueMode: () => void;
}

const QueueModeContext = createContext<QueueModeContextType | undefined>(undefined);

export const useQueueMode = () => {
  const context = useContext(QueueModeContext);
  if (!context) {
    throw new Error('useQueueMode must be used within a QueueModeProvider');
  }
  return context;
};

interface QueueModeProviderProps {
  children: ReactNode;
}

export const QueueModeProvider: React.FC<QueueModeProviderProps> = ({ children }) => {
  // default to capitalist mode, but check localStorage first
  const [queueMode, setQueueModeState] = useState<QueueMode>(() => {
    const savedMode = localStorage.getItem('queueMode');
    return (savedMode as QueueMode) || 'capitalist';
  });

  // default to wait mode, but check localStorage first
  const [priorityHandling, setPriorityHandlingState] = useState<PriorityHandling>(() => {
    const savedHandling = localStorage.getItem('priorityHandling');
    return (savedHandling as PriorityHandling) || 'wait';
  });

  // save to localStorage whenever the mode changes
  useEffect(() => {
    localStorage.setItem('queueMode', queueMode);
  }, [queueMode]);

  // save to localStorage whenever the priority handling changes
  useEffect(() => {
    localStorage.setItem('priorityHandling', priorityHandling);
  }, [priorityHandling]);

  const setQueueMode = (mode: QueueMode) => {
    setQueueModeState(mode);
  };

  const setPriorityHandling = (handling: PriorityHandling) => {
    setPriorityHandlingState(handling);
  };

  const toggleQueueMode = () => {
    setQueueModeState(prevMode => prevMode === 'capitalist' ? 'fifo' : 'capitalist');
  };

  return (
    <QueueModeContext.Provider value={{ 
      queueMode, 
      priorityHandling, 
      setQueueMode, 
      setPriorityHandling, 
      toggleQueueMode 
    }}>
      {children}
    </QueueModeContext.Provider>
  );
}; 