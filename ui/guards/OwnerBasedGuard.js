// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from '@apollo/react-hooks';

/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Alert, AlertTitle } from '@mui/material';

// import queries
import { devicesQuery } from '../pages/queries';
// ----------------------------------------------------------------------

export default function OwnerBasedGuard({ children }) {
  const [currentDevice, setCurrentDevice] = useState(null);
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const devicesData = useQuery(devicesQuery).data;

  useEffect(() => {
    if (devicesData) {
      const { devices } = devicesData;
      const cDevice = devices.find((device) => device._id === id);
      setCurrentDevice(cDevice);
    }
  }, [devicesData]);

  const loggedUser = Meteor.user();

  const [accessibleDevice, setAccessibleDevice] = useState(false);

  useEffect(() => {
    if (isEdit && currentDevice && loggedUser) {
      const { profile } = loggedUser;
      const { ownerId } = currentDevice;
      const { _id } = loggedUser;
      if (ownerId === _id) setAccessibleDevice(true);
      else if (profile.role === 'admin') setAccessibleDevice(true);
      else setAccessibleDevice(false);
    }
  }, [currentDevice, isEdit, loggedUser]);

  if (!accessibleDevice) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page. Make sure you are an admin, or owner of
          this device.
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}

OwnerBasedGuard.propTypes = {
  children: PropTypes.node,
};
