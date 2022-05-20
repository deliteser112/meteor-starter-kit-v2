import { useQuery } from '@apollo/react-hooks';

import React from 'react';
// material
import { Divider, Typography } from '@mui/material';
//
import OAuthLoginButton from './OAuthLoginButtons';

// import { oAuthServicesQuery } from '../../pages/queries';
import oAuthServicesQuery from '../../_queries/OAuth.gql';
// ----------------------------------------------------------------------

export default function OAuthSocial() {
  const { data } = useQuery(oAuthServicesQuery, {
    services: ['facebook', 'github', 'google'],
  });
  const oAuthServices = data && data.oAuthServices;
  return (
    <>
      {oAuthServices &&
        oAuthServices.map((service) => <OAuthLoginButton key={service} service={service} />)}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
