import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

import DarkLightMode from './DarkLightMode';

ThemeSettingLayout.propTypes = {
  children: PropTypes.node
};

export default function ThemeSettingLayout({ children }) {
  return (
    <div>
      {children}
      <DarkLightMode />
    </div>
  );
}
