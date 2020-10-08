import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';
import { GlobalStyles } from './theme/GlobalStyles';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <>
      <GlobalStyles />
      <App />
    </>
  </React.StrictMode>,
  rootElement
);
