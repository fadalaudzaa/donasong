export const theme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#F7F7F7',
    text: '#2C363F',
    error: '#FF4858',
    success: '#06D6A0',
  },
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  shadows: {
    brutal: '4px 4px 0px rgba(0, 0, 0, 0.9)',
    brutalHover: '6px 6px 0px rgba(0, 0, 0, 0.9)',
  },
  borders: {
    brutal: '3px solid #000000',
    thin: '1px solid #000000',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const;

export type Theme = typeof theme; 