import React from 'react';

// highlight
import './utils/highlight';
// editor
import 'react-quill/dist/quill.snow.css';
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

// auth
import { AuthProvider } from './contexts/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <NotistackProvider>
              <ScrollToTop />
              <BaseOptionChartStyle />
              <Router />
            </NotistackProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
