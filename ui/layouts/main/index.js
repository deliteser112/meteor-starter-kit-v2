import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';

import { useLocation, Outlet } from 'react-router-dom';
// @mui
import { Box, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();
  const { isLoading, user } = useTracker(() => {
    const handler = Meteor.subscribe('loggedInUser');

    let user = {};
    
    const userInfo = Meteor.user();

    const isUser = userInfo && userInfo.profile && userInfo.profile.firstName;

    if (!handler.ready() || !isUser) {
      return { isLoading: true };
    }

    if (isUser) user = userInfo;

    return { isLoading: false, user };
  });

  const isHome = pathname === '/';

  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader isLoading={isLoading} user={user} />

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />

      {/* {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default',
          }}
        >
          <Container>
            <Logo sx={{ mb: 1, mx: 'auto' }} />

            <Typography variant="caption" component="p">
              © All rights reserved
              <br /> made by &nbsp;
              <Link href="https://meteor.starter.kit/">meteor.starter.kit</Link>
            </Typography>
          </Container>
        </Box>
      )} */}
    </Stack>
  );
}
