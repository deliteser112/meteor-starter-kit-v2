import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// routes
import { PATH_DASHBOARD } from '../routes/paths';

// hooks
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

export default function GuestGuard({ children }) {
  // const isAuthenticated = useTracker(() => Meteor.user());
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
