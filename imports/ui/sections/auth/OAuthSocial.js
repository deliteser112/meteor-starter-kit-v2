
import { useQuery } from "@apollo/react-hooks";

import React from 'react';
// material
import { Divider, Typography } from '@mui/material';
// 
import OAuthLoginButton from './OAuthLoginButton';

import { oAuthServicesQuery } from '../../pages/queries';

// ----------------------------------------------------------------------

export default function OAuthSocial() {
  const  { loading, data, refetch } = useQuery(oAuthServicesQuery, { services: ['facebook', 'github', 'google']});
  const oAuthServices = data && data.oAuthServices;
  // const services = ['facebook', 'github', 'google'];
  return (
    <>
      {oAuthServices && oAuthServices.map((service) => (
        <OAuthLoginButton key={service} service={service} />
      ))}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
