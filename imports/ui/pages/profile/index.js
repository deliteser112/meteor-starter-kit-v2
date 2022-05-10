
// meteor
import { useTracker } from 'meteor/react-meteor-data';

import React from 'react';

// material
import {  Card, Container, Grid, Stack } from '@mui/material';

// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';

//
import ProfileCover from './ProfileCover';
import ProfileAbout from './ProfileAbout';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';

import account from '../../_mock/account';

// ----------------------------------------------------------------------

export default function UserProfile() {
  const user = useTracker(() => Meteor.user());
  const isUser = user && user.profile && user.profile.role;
  if (!isUser) return <LoadingScreen />;
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <ProfileFollowInfo profile={myProfile} />
              <ProfileAbout profile={{...myProfile, country: 'Madagascar', role: 'Manager', company: 'Gleichner, Mueller and Tromp', school: ' Nikolaus - Leuschke' }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <ProfilePostInput />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
