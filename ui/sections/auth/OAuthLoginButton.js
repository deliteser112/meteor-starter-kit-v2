import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';
import { Meteor } from 'meteor/meteor';

const handleLogin = (service, callback) => {
  const options = {
    facebook: {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    github: {
      requestPermissions: ['user:email'],
      loginStyle: 'redirect',
    },
    google: {
      requestPermissions: ['email', 'profile'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
  }[service];

  return {
    facebook: Meteor.loginWithFacebook,
    github: Meteor.loginWithGithub,
    google: Meteor.loginWithGoogle,
  }[service](options, callback);
};

const serviceLabel = {
  facebook: (
    <>
      <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
        <img src="/static/icons/social-facebook.svg" alt="facebook" width={40} height={40} />
      </Box>
      Sign in with Facebook
    </>
  ),
  github: (
    <>
      <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
        <img src="/static/icons/social-github.svg" alt="github" width={40} height={40} />
      </Box>
      Sign in with Github
    </>
  ),
  google: (
    <>
      <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
        <img src="/static/icons/social-google.svg" alt="google" width={40} height={40} />
      </Box>
      Sign in with Google
    </>
  ),
};

function OAuthLoginButton({ service, callback }) {
  const theme = useTheme();
  return (
    <Button
      disableElevation
      fullWidth
      onClick={() => handleLogin(service, callback)}
      size="large"
      color="secondary"
      variant="contained"
      sx={{
        marginBottom: 2,
        color: 'grey.700',
        backgroundColor: theme.palette.grey[50],
        borderColor: theme.palette.grey[100],
        '&:hover': {
          backgroundColor: alpha(theme.palette.grey[800], 0.1),
        },
      }}
    >
      {serviceLabel[service]}
    </Button>
  );
}

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) console.log('Here is error');
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

export default OAuthLoginButton;
