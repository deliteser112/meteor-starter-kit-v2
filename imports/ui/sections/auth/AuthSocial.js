import React from 'react';
// material
import { useTheme } from '@mui/material/styles';
import { Stack, Button, Divider, Typography, Box } from '@mui/material';
// component
// import Iconify from '../../components/Iconify';

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
          variant="outlined"
          sx={{
              color: 'grey.700',
              backgroundColor: theme.palette.grey[50],
              borderColor: theme.palette.grey[100]
          }}
      >
          <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
              <img src="/static/icons/social-google.svg" alt="google" width={16} height={16} />
          </Box>
          Sign in with Google
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
