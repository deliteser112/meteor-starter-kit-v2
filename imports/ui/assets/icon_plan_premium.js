import React, { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PlanPremiumIcon({ ...other }) {
  const theme = useTheme();

  return (
    <Box {...other} component="img" src="/static/home/team02.webp" />
  );
}

export default memo(PlanPremiumIcon);
