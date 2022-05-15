/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PlanPremiumIcon({ ...other }) {
  return <Box {...other} component="img" src="/static/home/team02.webp" />;
}

export default memo(PlanPremiumIcon);
