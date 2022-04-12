import React from 'react';
import ReactDOM from 'react-dom';

import { Router as MemoryRouter } from 'react-router';
import { OverlayProvider } from 'react-aria';

import { history } from './memoryHistory';

import { App } from './App';
import { GlobalStyles } from '../shared/theme/GlobalStyles';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter history={history}>
      <OverlayProvider>
        <GlobalStyles />
        <App />
      </OverlayProvider>
    </MemoryRouter>
  </React.StrictMode>,
  rootElement
);
