/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PlanFreeIcon({ ...other }) {
  return <Box {...other} component="img" src="/static/home/team01.webp" />;
}

export default memo(PlanFreeIcon);
