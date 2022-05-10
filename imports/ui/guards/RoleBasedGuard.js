// meteors
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  children: PropTypes.node
};

export default function RoleBasedGuard({ children }) {
  // const loggedUser = Meteor.user();
  const loggedUser = useTracker(() => Meteor.user());

  const [accessibleDevice, setAccessibleDevice] = useState(false);

  useEffect(() => {
    if (loggedUser) {
      const { profile } = loggedUser;
      if (profile.role === 'admin') setAccessibleDevice(true);
      else setAccessibleDevice(false);
    }
  }, [loggedUser]);

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
