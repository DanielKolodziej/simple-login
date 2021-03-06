import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router
} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';

import App from './components/App';


render(
  <CookiesProvider>
      <Router>
        <App />
      </Router>
  </CookiesProvider>,
  document.getElementById('root')
);
