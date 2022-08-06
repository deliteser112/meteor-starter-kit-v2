import PropTypes from 'prop-types';
import React, { createContext } from 'react';
// hooks
import useLocalStorage from '../hooks/useLocalStorage';
// config
import { defaultSettings } from '../config';

// ----------------------------------------------------------------------

const initialState = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

SettingsProvider.propTypes = {
  children: PropTypes.node,
};

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: initialState.themeMode
  });

  // Mode

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeMode = (value) => {
    setSettings({
      ...settings,
      themeMode: value,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // Mode
        onToggleMode,
        onChangeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };
