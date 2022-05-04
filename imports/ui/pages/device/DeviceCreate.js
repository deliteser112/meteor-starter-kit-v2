// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from "@apollo/react-hooks";
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useParams, useLocation } from 'react-router-dom';
// material
import { 
  Container, 
  Stack, 
  Typography
} from '@mui/material';

// components
import Page from '../../components/Page';
import DeviceNewForm from './DeviceNewForm';

// import queries
import {usersQuery, devicesQuery} from '../queries'
// ----------------------------------------------------------------------

export default function DeviceCreate() {
  const [currentDevice, setCurrentDevice] = useState(null)
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const devicesData = useQuery(devicesQuery).data;

  useEffect(() => {
    if(isEdit && devicesData) {
      const { devices } = devicesData;
      const cDevice = devices.find((device) => device._id === id);
      setCurrentDevice(cDevice);
    }
  }, [devicesData, isEdit])

  const  { loading, data, refetch } = useQuery(usersQuery);

  useTracker(() => {
    Meteor.subscribe('users');
  });

  refetch();

  const userList = data && data.allUsers || [];

  const loggedUser = Meteor.user();

  return (
    <Page title={isEdit ? 'Update a Device' : 'Create a Device'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update device' : 'Create a new device'}
          </Typography>
        </Stack>
        {loading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DeviceNewForm isEdit={isEdit} loggedUser={loggedUser} currentDevice={currentDevice} userList={userList} />
        }
      </Container>
    </Page>
  );
}
