/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { LazyMotion } from 'framer-motion';

// ----------------------------------------------------------------------

// eslint-disable-next-line import/extensions
const loadFeatures = () => import('./features.js').then((res) => res.default);

export default function MotionLazyContainer({ children }) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}

MotionLazyContainer.propTypes = {
  children: PropTypes.node,
};
