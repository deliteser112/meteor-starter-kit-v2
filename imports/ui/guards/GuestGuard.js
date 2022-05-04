import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const isAuthenticated = useTracker(() => Meteor.user());
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard/analytics" />;
  }

  return <>{children}</>;
}
