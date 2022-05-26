// meteor
import { useQuery } from '@apollo/react-hooks';
import { capitalCase } from 'change-case';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

// material
import { styled } from '@mui/material/styles';
import { Tabs, Tab, Card, Container, Box } from '@mui/material';

// components
import Page from '../../../components/Page';
// import LoadingScreen from '../../../components/LoadingScreen';
import Iconify from '../../../components/Iconify';

//
import ProfileCover from './ProfileCover';
import ProfileSettings from './ProfileSettings';
import ProfileGeneral from './ProfileGeneral';

import account from '../../../_mock/account';

// import queries
import { user as userQuery } from '../../../_queries/Users.gql';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

export default function UserProfile() {
  const { userId } = useParams();
  const { data, loading } = useQuery(userQuery, { variables: { _id: userId } });
  const [currentTab, onChangeTab] = useState('profile');

  const user = data && data.user;

  console.log(user);
  if (loading)
    return (
      <ReactLoading className="loading-icons" type="spin" color="grey" height={40} width={40} />
    );
  const { _id, name, emailAddress } = user;
  const { coverURL } = account;

  const myProfile = {
    _id,
    position: 'Admin',
    email: emailAddress,
    displayName: `${name.first} ${name.last ? name.last : ''}`,
    coverURL,
  };

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Iconify icon="ic:round-account-box" width={20} height={20} />,
      component: <ProfileGeneral currentUser={user} isEdit />,
    },
    {
      value: 'settings',
      icon: <Iconify icon="eva:heart-fill" width={20} height={20} />,
      component: <ProfileSettings settings={user.settings} userId={user._id} />,
    },
  ];
  return (
    <Page title="Profile">
      <Container>
        <Card
          sx={{
            mb: 3,
            height: 220,
            position: 'relative',
          }}
        >
          <ProfileCover myProfile={myProfile} />
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={(event, newValue) => onChangeTab(newValue)}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  label={capitalCase(tab.value)}
                />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
