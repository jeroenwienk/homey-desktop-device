import React from 'react';
import ReactDOM from 'react-dom';

import { createGlobalStyle } from 'styled-components';

import { GlobalStyles } from './theme/GlobalStyles';

const rootElement = document.getElementById('root');

const Test = createGlobalStyle`
  body {
    color: white;
    background-color: green;
    padding: 10px;
  }

  .test {
    -webkit-app-region: drag;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles/>
    <Test/>
    <div className="test">dragme</div>
  </React.StrictMode>,
  rootElement
);
