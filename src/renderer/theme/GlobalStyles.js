import { createGlobalStyle } from 'styled-components';

export function VAR(value) {
  return `var(${value})`;
}

export const VARIABLES = {
  COLOR_PRIMARY_TEXT: '--color-primary-text',
  COLOR_PRIMARY_TEXT_ACCENT: '--color-primary-text-accent',
  COLOR_PRIMARY_TEXT_DARK: '--color-primary-text-dark',
  COLOR_PRIMARY_TEXT_DARK_ACCENT: '--color-primary-text-dark-accent',

  COLOR_BACKGROUND_APP: '--color-background-app',
  COLOR_BACKGROUND_PANEL: '--color-background-panel',
  COLOR_BACKGROUND_LIGHT: '--color-background-white',
  COLOR_BACKGROUND_OVERLAY: '--color-background-overlay',
  COLOR_BACKGROUND_DIALOG: '--color-background-dialog',
  COLOR_BACKGROUND_INPUT: '--color-background-input',
  COLOR_BACKGROUND_BUTTON: '--color-background-button',

  COLOR_ICON_DARK: '--color-icon-dark',
  COLOR_ICON_LIGHT: '--color-icon-light',

  COLOR_HOVER: '--color-hover',
  COLOR_ACTIVE: '--color-active',
  COLOR_FOCUS: '--color-focus',
  COLOR_FOCUS_ACCENT: '--color-focus-accent',
  COLOR_SELECTED: '--color-selected',
  COLOR_SELECTED_ACCENT: '--color-selected-accent',

  COLOR_GREEN: '--color-green',
  COLOR_RED: '--color-red',
  COLOR_YELLOW: '--color-yellow',
  COLOR_BLUE: '--color-blue',

  BORDER_ERROR: '--border-error',
  BORDER_FOCUS: '--border-focus',

  BOX_SHADOW_DEFAULT: '--box-shadow-default',
  BOX_SHADOW_DIALOG: '--box-shadow-dialog',
  BOX_SHADOW_HEADER: '--box-shadow-header',

  Z_INDEX_OVERLAY: '--z-index-overlay',
  Z_INDEX_HEADER: '--z-index-header',
};

export const GlobalStyles = createGlobalStyle`
  :root {
    ${VARIABLES.COLOR_PRIMARY_TEXT}: rgba(255, 255, 255, 1);
    ${VARIABLES.COLOR_PRIMARY_TEXT_ACCENT}: rgba(170, 170, 170, 1);
    ${VARIABLES.COLOR_PRIMARY_TEXT_DARK}: rgba(41, 41, 41, 1);
    ${VARIABLES.COLOR_PRIMARY_TEXT_DARK_ACCENT}: rgba(81, 81, 81, 1);
    
    ${VARIABLES.COLOR_BACKGROUND_APP}: rgba(24, 24, 24, 1);
    ${VARIABLES.COLOR_BACKGROUND_PANEL}: rgba(32, 32, 32, 1);
    ${VARIABLES.COLOR_BACKGROUND_LIGHT}: rgba(255, 255, 255, 1);
    ${VARIABLES.COLOR_BACKGROUND_OVERLAY}: rgb(0, 0, 0, 0.5);
    ${VARIABLES.COLOR_BACKGROUND_DIALOG}: rgba(32, 32, 32, 1);
    ${VARIABLES.COLOR_BACKGROUND_INPUT}: rgba(24, 24, 24, 1);
    ${VARIABLES.COLOR_BACKGROUND_BUTTON}: rgba(255, 255, 255, 0.1);
    
    ${VARIABLES.COLOR_ICON_DARK}: rgba(41, 41, 41, 1);
    ${VARIABLES.COLOR_ICON_LIGHT}: rgba(255, 255, 255, 1);
    
    ${VARIABLES.COLOR_HOVER}: rgba(255, 255, 255, 0.1);
    ${VARIABLES.COLOR_ACTIVE}: rgba(255, 255, 255, 0.2);
    ${VARIABLES.COLOR_FOCUS}: rgba(229, 192, 123, 1);
    ${VARIABLES.COLOR_FOCUS_ACCENT}: rgba(229, 192, 123, 0.05);
    ${VARIABLES.COLOR_SELECTED}: rgba(97, 175, 239, 1);
    ${VARIABLES.COLOR_SELECTED_ACCENT}: rgba(97, 175, 239, 0.05);
    
    ${VARIABLES.COLOR_GREEN}: #98c379;
    ${VARIABLES.COLOR_RED}: #e06c75;
    ${VARIABLES.COLOR_YELLOW}: #e5c07b;
    ${VARIABLES.COLOR_BLUE}: #61afef;
    
    ${VARIABLES.BORDER_ERROR}: 2px solid #e06c75;
    ${VARIABLES.BORDER_FOCUS}: 2px solid #e5c07b;
    
    ${
      VARIABLES.BOX_SHADOW_DEFAULT
    }: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.1);
    ${
      VARIABLES.BOX_SHADOW_DIALOG
    }: 0 2px 5px 0 rgba(0, 0, 0, 0.26), 0 2px 10px 0 rgba(0, 0, 0, 0.16);
    ${VARIABLES.BOX_SHADOW_HEADER}: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
    
    ${VARIABLES.Z_INDEX_OVERLAY}: 2;
    ${VARIABLES.Z_INDEX_HEADER}: 1;
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
    background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_APP)};
  }
  
  button, input, ul {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font: inherit;
  }
  
  ul {
    list-style: none;
  }
  
`;
