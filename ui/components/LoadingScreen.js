import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
//
import { NAVBAR } from '../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  isDashboard: PropTypes.bool
};

export default function LoadingScreen({ isDashboard, ...other }) {
  return (
    <>
      <Box
        sx={{
          right: 0,
          bottom: 0,
          zIndex: 99999,
          width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
          height: '100%',
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>

      {!isDashboard && (
        <RootStyle {...other}>
          <CircularProgress />
        </RootStyle>
      )}
    </>
  );
}
