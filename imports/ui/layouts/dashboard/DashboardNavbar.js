import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import EmailVerifyAlert from './EmailVerifyAlert';
//
import AccountPopover from './AccountPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 65;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  isLoading: PropTypes.bool,
  user: PropTypes.object
};

export default function DashboardNavbar({ onOpenSidebar, isLoading, user }) {
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    if (user && user.emails) {
      const { emails, profile } = user;
      setEmail(emails[0].address);
      setEmailVerified(emails[0].verified);
    }
  }, [user])
  return (
    <RootStyle>
      {!emailVerified && <EmailVerifyAlert email={email} verifyEmail={() => console.log('sending the code')} />}
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover isLoading={isLoading} user={user} />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
