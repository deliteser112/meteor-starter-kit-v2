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
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import ThemeSettings from './components/settings';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <AuthProvider>
              <ThemeProvider>
                <ThemeSettings>
                  <NotistackProvider>
                    <ScrollToTop />
                    <BaseOptionChartStyle />
                    <Router />
                  </NotistackProvider>
                </ThemeSettings>
              </ThemeProvider>
            </AuthProvider>
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}
