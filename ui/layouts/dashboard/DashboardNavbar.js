import { useMutation } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import EmailVerifyAlert from './EmailVerifyAlert';
import AccountPopover from './AccountPopover';

// utils
import cssStyles from '../../utils/cssStyles';

// config
import { HEADER, NAVBAR } from '../../config';

// hooks
import useAuth from '../../hooks/useAuth';
import useOffSetTop from '../../hooks/useOffSetTop';

// graphql
import { sendVerificationEmail as sendVerificationEmailMutation } from '../../_mutations/Users.gql';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 65;


const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout'
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default
    })
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardNavbar({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const { user } = useAuth();
  const [sendVerificationEmail] = useMutation(sendVerificationEmailMutation);
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    if (user && user.emails) {
      const { emails } = user;
      setEmail(emails[0].address);
      setEmailVerified(emails[0].verified);
    }
  }, [user]);

  const handleSendVerifyEmail = async () => {
    sendVerificationEmail();
    return { data: 'success' };
  };
  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      {!emailVerified && <EmailVerifyAlert email={email} verifyEmail={handleSendVerifyEmail} />}
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  verticalLayout: PropTypes.bool,
  isCollapse: PropTypes.bool,
};
