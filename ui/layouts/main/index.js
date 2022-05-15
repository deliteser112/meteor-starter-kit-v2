import React from 'react';

import { Outlet } from 'react-router-dom';
// @mui
import { Box, Stack } from '@mui/material';
//
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';
// ----------------------------------------------------------------------

export default function MainLayout() {
  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader />
      <Outlet />
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
    </Stack>
  );
}
