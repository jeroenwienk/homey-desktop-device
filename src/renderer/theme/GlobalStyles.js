import { createGlobalStyle } from 'styled-components';

const varHandler = {
  get: function (target, prop, receiver) {
    if (target[prop] == null) throw new Error(`Unknown key: ${prop}`);
    return `var(--${prop.replaceAll('_', '-')})`;
  },
};

const valueHandler = {
  get: function (target, prop, receiver) {
    if (target[prop] == null) throw new Error(`Unknown key: ${prop}`);
    return `--${prop.replaceAll('_', '-')}: ${target[prop]}`;
  },
};

const colorVars = {
  color_white: 'rgba(255, 255, 255, 1)',
  color_nero: 'rgba(41, 41, 41, 1)',
  color_grey: 'rgba(170, 170, 170, 1)',
  color_grey_dark: 'rgba(81, 81, 81, 1)',

  color_green: 'rgba(152, 195, 121, 1)',
  color_green_005: 'rgba(152, 195, 121, 0.05)',

  color_red: 'rgba(224, 108, 117, 1)',
  color_red_005: 'rgb(224, 108, 117, 0.05)',

  color_yellow: 'rgba(229, 192, 123, 1)',
  color_yellow_005: 'rgba(229, 192, 123, 0.05)',

  color_blue: 'rgba(97, 175, 239, 1)',
  color_blue_005: 'rgba(97, 175, 239, 0.05)',
};

const colors = new Proxy(colorVars, varHandler);

const colorFunctionalVars = {
  color_primary_text: colors.color_white,
  color_primary_text_accent: colors.color_grey,

  color_primary_text_dark: colors.color_nero,
  color_primary_text_dark_accent: colors.color_grey_dark,

  color_icon_dark: colors.color_nero,
  color_icon_light: colors.color_white,

  color_background_app: 'rgba(24, 24, 24, 1)',
  color_background_panel: 'rgba(32, 32, 32, 1)',
  color_background_light: colors.color_white,
  color_background_overlay: 'rgb(0, 0, 0, 0.5)',
  color_background_dialog: 'rgba(32, 32, 32, 1)',
  color_background_input: 'rgba(24, 24, 24, 1)',
  color_background_button: 'rgba(255, 255, 255, 0.1)',

  color_hover: 'rgba(255, 255, 255, 0.1)',
  color_active: 'rgba(255, 255, 255, 0.2)',
  color_focus: colors.color_yellow,
  color_focus_accent: colors.color_yellow_005,
  color_selected: colors.color_blue,
  color_selected_accent: colors.color_blue_005,
};

const colorsFunctional = new Proxy(colorFunctionalVars, varHandler);

const borderVars = {
  border_error: `2px solid ${colors.color_red}`,
  border_focus: `2px solid ${colors.color_yellow}`,
};

const zIndexVars = {
  z_index_overlay: 2,
  z_index_header: 1,
};

const boxShadowVars = {
  box_shadow_default: `0 0 2px 0 rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.1)`,
  box_shadow_dialog: `0 2px 5px 0 rgba(0, 0, 0, 0.26), 0 2px 10px 0 rgba(0, 0, 0, 0.16)`,
  box_shadow_header: `0 1px 3px 0 rgba(0, 0, 0, 0.4)`,
};

const target = {
  ...colorVars,
  ...colorFunctionalVars,
  ...borderVars,
  ...zIndexVars,
  ...boxShadowVars,
};

export const vars = new Proxy(target, varHandler);
const values = new Proxy(target, valueHandler);

export const GlobalStyles = createGlobalStyle`
  :root {
    ${Object.values(values)
      .map((value) => {
        return value;
      })
      .join(';')};
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    font-size: 16px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    background-color: ${vars.color_background_app};
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
