// meteors
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  children: PropTypes.node
};

export default function RoleBasedGuard({ children }) {
  const { user } = useAuth();

  const [accessibleDevice, setAccessibleDevice] = useState(false);

  useEffect(() => {
    if (user) {
      if (Roles.userIsInRole(user._id, 'admin')) setAccessibleDevice(true);
      else setAccessibleDevice(false);
    }
  }, [user]);

  if (!accessibleDevice) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
            You do not have permission to access this page. Make sure you are an admin.
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
