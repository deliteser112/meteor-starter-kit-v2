
import React from 'react';
import { useParams } from 'react-router-dom';

// material
import {  Card, Container } from '@mui/material';

// components
import Page from '../../components/Page';
import ProfileCover from './ProfileCover';

import account from '../../_mock/account';

// ----------------------------------------------------------------------

export default function UserProfile() {
  const user = Meteor.user();
  const { _id, profile, emails } = user;
  const { coverURL } = account;

  const myProfile = {
    _id,
    position: profile.role,
    email: emails[0].address,
    displayName: `${profile.firstName} ${profile.lastName}`,
    coverURL
  }

  return (
    <Page title="Profile">
      <Container>
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover myProfile={myProfile} />
        </Card>
      </Container>
    </Page>
  );
}
