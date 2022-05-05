import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Alert, Typography, Stack, Link } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';

export default function VerifyAlert() {
  return (
    <Alert severity="error">
      <Stack direction="row" alignItems="center">
        <Typography variant="body2">Hey friend! Can you
          <Typography variant="body2" component="span" sx={{ fontWeight: 700 }}> verify your email address</Typography>
          <Typography variant="body2" component="span"> for us? &nbsp;</Typography>
        </Typography>
        <Link
          to={PATH_AUTH.verify}
          color="inherit"
          variant="body2"
          component={RouterLink}
          sx={{ display: 'block' }}
        >
          Re-send verification email
        </Link>
      </Stack>
    </Alert>
  );
}
