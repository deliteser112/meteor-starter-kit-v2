import React from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import NotistackProvider from './components/NotistackProvider';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <NotistackProvider>
            <ScrollToTop />
            <BaseOptionChartStyle />
            <Router />
          </NotistackProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
