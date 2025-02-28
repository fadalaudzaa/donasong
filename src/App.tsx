import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import InputPage from './pages/InputPage';
import QueuePage from './pages/QueuePage';
import ObsQueuePage from './pages/ObsQueuePage';
import { QueueModeProvider } from './lib/QueueModeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <QueueModeProvider>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route path="/" element={<InputPage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/obs" element={<ObsQueuePage />} />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                border: theme.borders.brutal,
                boxShadow: theme.shadows.brutal,
                background: theme.colors.background,
                color: theme.colors.text,
              },
            }}
          />
        </QueueModeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
