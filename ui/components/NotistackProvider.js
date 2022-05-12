import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';
// material
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
// components
import Iconify from './Iconify';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';

  const createStyle = {
    color: `${theme.palette.text.primary} !important`,
    backgroundColor: `${theme.palette.background.paper} !important`
  };

  return {
    containerRoot: {
      pointerEvents: 'unset',
      '& .MuiCollapse-wrapperInner': {
        width: '100%'
      }
    },
    contentRoot: {
      width: '100%',
      padding: theme.spacing(1.5),
      margin: theme.spacing(0.25, 0),
      boxShadow: theme.customShadows.z8,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.grey[isLight ? 0 : 800],
      backgroundColor: theme.palette.grey[isLight ? 900 : 0]
    },
    message: {
      padding: 0,
      fontWeight: theme.typography.fontWeightMedium
    },
    action: {
      marginRight: -4,
      '& svg': {
        width: 20,
        height: 20,
        opacity: 0.48,
        '&:hover': { opacity: 1 }
      }
    },
    info: { ...createStyle },
    success: { ...createStyle },
    warning: { ...createStyle },
    error: { ...createStyle }
  };
});

// ----------------------------------------------------------------------

SnackbarIcon.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string
};

function SnackbarIcon({ icon, color }) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16)
      }}
    >
      <Iconify icon={icon} width={24} height={24} />
    </Box>
  );
}

NotistackProvider.propTypes = {
  children: PropTypes.node
};

export default function NotistackProvider({ children }) {
  const classes = useStyles();

  return (
    <SnackbarProvider
      dense
      maxSnack={5}
      // preventDuplicate
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      iconVariant={{
        success: <SnackbarIcon icon="eva:checkmark-circle-2-fill" color="success" />,
        error: <SnackbarIcon icon="eva:info-fill" color="error" />,
        warning: <SnackbarIcon icon="eva:alert-triangle-fill" color="warning" />,
        info: <SnackbarIcon icon="eva:alert-circle-fill" color="info" />
      }}
      classes={{
        containerRoot: classes.containerRoot,
        contentRoot: classes.contentRoot,
        message: classes.message,
        action: classes.action,
        variantInfo: classes.info,
        variantSuccess: classes.success,
        variantWarning: classes.warning,
        variantError: classes.error
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
