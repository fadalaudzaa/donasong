import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.5;
    min-height: 100%;
  }

  /* For the OBS page with transparent background */
  body.transparent-bg {
    background-color: transparent !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
  }

  button {
    cursor: pointer;
    font-family: ${theme.fonts.heading};
    font-weight: 500;
    border: ${theme.borders.brutal};
    background-color: ${theme.colors.primary};
    color: white;
    padding: 0.5rem 1rem;
    box-shadow: ${theme.shadows.brutal};
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: ${theme.shadows.brutalHover};
    }

    &:active {
      transform: translate(0, 0);
      box-shadow: none;
    }
  }

  input {
    font-family: ${theme.fonts.body};
    border: ${theme.borders.brutal};
    padding: 0.5rem;
    background-color: white;
    box-shadow: ${theme.shadows.brutal};

    &:focus {
      outline: none;
      box-shadow: ${theme.shadows.brutalHover};
    }
  }
`; 