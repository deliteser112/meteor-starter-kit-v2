import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const isAuthenticated = useTracker(() => Meteor.user());
  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}
