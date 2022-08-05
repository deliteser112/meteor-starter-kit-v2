import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';

// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';

// config
import { HEADER, NAVBAR } from '../../config';

// components
import GDPRConsentModal from '../../components/GDPRConsentModal';
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

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick'
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter
    }),

    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
    })
  }
}));

// const MainStyle = styled('main', {
//   shouldForwardProp: (prop) => prop !== 'collapseClick',
// })(({ collapseClick, theme }) => ({
//   flexGrow: 1,
//   paddingTop: HEADER.MOBILE_HEIGHT + 24,
//   paddingBottom: HEADER.MOBILE_HEIGHT + 24,
//   [theme.breakpoints.up('lg')]: {
//     paddingLeft: 16,
//     paddingRight: 16,
//     paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
//     paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
//     width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
//     transition: theme.transitions.create('margin-left', {
//       duration: theme.transitions.duration.shorter,
//     }),
//     ...(collapseClick && {
//       marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
//     }),
//   },
// }));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <GDPRConsentModal />
      <DashboardNavbar isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
