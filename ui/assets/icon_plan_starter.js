/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PlanStarterIcon({ ...other }) {
  return <Box {...other} component="img" src="/static/home/team03.webp" />;
}

export default memo(PlanStarterIcon);
