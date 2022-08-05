import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Stack, Typography, Slide, Link, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
// ----------------------------------------------------------------------

const APPBAR_MOBILE = 90;
const APPBAR_DESKTOP = 60;

const AlertbarStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  // backgroundColor: 'green',
  backgroundColor: `${alpha(theme.palette.primary.darker, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 7),
  },
}));

// ----------------------------------------------------------------------

export default function EmailVerifyAlert({ email, verifyEmail }) {
  const [isOpen, setOpen] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setSent(false);
    const res = await verifyEmail(email);
    const { data } = res;
    if (data === 'success') {
      setTimeout(() => {
        setLoading(false);
        setSent(true);
      }, 1000);
    }
  };

  return (
    <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
      <AlertbarStyle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'center' }}>
              Hi friend! Can you
              <Typography variant="body2" component="span" sx={{ fontWeight: 700 }}>
                {' '}
                verify your email address
              </Typography>
              <Typography variant="body2" component="span">
                {' '}
                <Typography variant="body2" component="span" sx={{ textDecoration: 'underline' }}>
                  {email}
                </Typography>
                &nbsp;for us? &nbsp;
              </Typography>
            </Typography>
            <Link
              color="primary"
              variant="body2"
              onClick={handleVerifyEmail}
              sx={{ display: 'block', color: 'rgb(161 220 249)', marginRight: 1, '&:hover': { cursor: 'pointer' } }}
            >
              Send verification email
            </Link>
            {isLoading && <ReactLoading type="spin" color="grey" height={15} width={15} />}
            {isSent && <CheckIcon color="success" sx={{ width: 20, heigth: 20 }} />}
          </Stack>
          <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Stack>
      </AlertbarStyle>
    </Slide>
  );
}

EmailVerifyAlert.defaultProps = {
  email: '',
  verifyEmail: null,
};

EmailVerifyAlert.propTypes = {
  email: PropTypes.string,
  verifyEmail: PropTypes.func,
};
