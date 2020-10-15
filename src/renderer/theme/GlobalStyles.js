import { createGlobalStyle } from 'styled-components';

export const VARIABLES = {
  COLOR_BACKGROUND_LIGHT: '--color-background-white',
  COLOR_PRIMARY_TEXT: '--color-primary-text',
  COLOR_PRIMARY_TEXT_DARK: '--color-primary-text-dark',
  COLOR_PRIMARY_TEXT_DARK_ACCENT: '--color-primary-text-dark-accent',

  COLOR_ICON_DARK: '--color-icon-dark',
  COLOR_ICON_LIGHT: '--color-icon-light',

  COLOR_HOVER: '--color-hover',
  COLOR_ACTIVE: '--color-active',
  COLOR_FOCUS: '--color-focus',
  COLOR_FOCUS_ACCENT: '--color-focus-accent',
  COLOR_SELECTED: '--color-selected',
  COLOR_SELECTED_ACCENT: '--color-selected-accent',

  BORDER_ERROR: '--border-error',
  BORDER_FOCUS: '--border-focus',

  BOX_SHADOW_DEFAULT: '--box-shadow-default',
  BOX_SHADOW_DEFAULT_LIGHT: '--box-shadow-default-light',
};

export function VAR(value) {
  return `var(${value})`;
}

export const GlobalStyles = createGlobalStyle`
  :root {
    ${VARIABLES.COLOR_PRIMARY_TEXT}: rgba(255, 255, 255, 1);
    ${VARIABLES.COLOR_PRIMARY_TEXT_DARK}: rgba(41, 41, 41, 1);
    ${VARIABLES.COLOR_PRIMARY_TEXT_DARK_ACCENT}: rgba(41, 41, 41, 0.5);
    ${VARIABLES.COLOR_BACKGROUND_LIGHT}: rgba(255, 255, 255, 1);
    
    ${VARIABLES.COLOR_ICON_DARK}: rgba(41, 41, 41, 1);
    ${VARIABLES.COLOR_ICON_LIGHT}: rgba(255, 255, 255, 1);
    
    ${VARIABLES.COLOR_HOVER}: rgba(255, 255, 255, 0.1);
    ${VARIABLES.COLOR_ACTIVE}: rgba(255, 255, 255, 0.2);
    ${VARIABLES.COLOR_FOCUS}: rgba(255, 151, 19, 1);
    ${VARIABLES.COLOR_FOCUS_ACCENT}: rgba(255, 151, 19, 0.05);
    ${VARIABLES.COLOR_SELECTED}: rgba(0, 128, 255, 1);
    ${VARIABLES.COLOR_SELECTED_ACCENT}: rgba(0, 128, 255, 0.05);
    
    ${VARIABLES.BORDER_ERROR}: 2px solid rgba(198, 40, 40, 1);
    ${VARIABLES.BORDER_FOCUS}: 2px solid rgba(255, 151, 19, 1);
    
    ${VARIABLES.BOX_SHADOW_DEFAULT}: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    ${VARIABLES.BOX_SHADOW_DEFAULT_LIGHT}: 0 1px 3px 0 rgba(255, 255, 255, 0.12), 0 1px 2px 0 rgba(255, 255, 255, 0.24);
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
    font-size: 16px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }
  
  button, input{
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font: inherit;
  }
`;
