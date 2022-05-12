import React, { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PlanFreeIcon({ ...other }) {
  const theme = useTheme();
  return (
    <Box {...other} component="img" src="/static/home/team01.webp" />
  );
}

export default memo(PlanFreeIcon);
