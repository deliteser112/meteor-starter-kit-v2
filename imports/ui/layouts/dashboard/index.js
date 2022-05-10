import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

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

  return (
    <RootStyle>
      <DashboardNavbar isLoading={isLoading} user={user} onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isLoading={isLoading} user={user} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
