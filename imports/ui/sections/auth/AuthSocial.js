
import React from 'react';
// material
import { useTheme, alpha } from '@mui/material/styles';
import { Button, Divider, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const theme = useTheme();
  return (
    <>
      <Button
        disableElevation
        fullWidth
        // onClick={googleHandler}
        size="large"
        color="secondary"
        variant="contained"
        sx={{
            color: 'grey.700',
            backgroundColor: theme.palette.grey[50],
            borderColor: theme.palette.grey[100],
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[800], 0.1)
            }
        }}
      >
        <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
            <img src="/static/icons/social-google.svg" alt="google" width={40} height={40} />
        </Box>
        Sign in with Google
      </Button>
      <Box m={1} />
      <Button
        disableElevation
        fullWidth
        // onClick={googleHandler}
        size="large"
        color="secondary"
        variant="contained"
        sx={{
            color: 'grey.700',
            backgroundColor: theme.palette.grey[50],
            borderColor: theme.palette.grey[100],
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[800], 0.1)
            }
        }}
      >
        <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
            <img src="/static/icons/social-github.svg" alt="github" width={40} height={40} />
        </Box>
        Sign in with Github
      </Button>
      <Box m={1} />

      <Button
        disableElevation
        fullWidth
        // onClick={googleHandler}
        size="large"
        color="secondary"
        variant="contained"
        sx={{
            color: 'grey.700',
            backgroundColor: theme.palette.grey[50],
            borderColor: theme.palette.grey[100],
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[800], 0.1)
            }
        }}
      >
        <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
            <img src="/static/icons/social-facebook.svg" alt="facebook" width={40} height={40} />
        </Box>
        Sign in with Facebook
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
