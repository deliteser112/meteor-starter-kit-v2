import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Stack, Typography, Slide, Link, IconButton } from '@mui/material';

// routes
import { PATH_AUTH } from '../../routes/paths';
// ----------------------------------------------------------------------

const APPBAR_MOBILE = 90;
const APPBAR_DESKTOP = 45;

const AlertbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  // backgroundColor: 'green',
  backgroundColor: `${alpha(theme.palette.error.lighter, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

EmailVerifyAlert.propTypes = {
  email: PropTypes.string,
  verifyEmail: PropTypes.func
};

export default function EmailVerifyAlert({ email, verifyEmail }) {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    const res = await verifyEmail(email);
    const { data } = res;
    if (data === 'success') {
      setLoading(false);
      navigate(PATH_AUTH.verify);
    }
    // navigate(PATH_AUTH.verify);
  };

  return (
    <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
      <AlertbarStyle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Hey friend! Can you
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
              // to={PATH_AUTH.verify}
              color="primary"
              variant="body2"
              onClick={handleVerifyEmail}
              // component={RouterLink}
              sx={{ display: 'block', '&:hover': { cursor: 'pointer' } }}
            >
              Send verification email
            </Link>
            {isLoading && <ReactLoading type="bars" color="grey" height={30} width={30} />}
          </Stack>
          <IconButton size="small" onClick={handleClose}>
            <Icon icon={'eva:close-fill'} />
          </IconButton>
        </Stack>
      </AlertbarStyle>
    </Slide>
  );
}
