import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container, Typography, Stack } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { DevicesCollection } from '/imports/db/DevicesCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {devicesQuery, usersQuery} from '../../queries'

// components
import Page from '../../../components/Page';
import DeviceList from './DeviceList';
// sections
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

export default function Device() {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  const loggedUser = Meteor.user();

  const tmpUsers = useQuery(usersQuery).data;
  const  { loading, data, refetch } = useQuery(devicesQuery);

  refetch();

  const { isLoading, deviceCount } = useTracker(() => {
    const noDataAvailable = { deviceCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('devices');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const deviceCount = DevicesCollection.find({}).count();

    return { deviceCount };
  });
 
  const devicesData = data && data.devices || [];

  const deleteDevice = (_id) => {
    Meteor.call('devices.remove', _id);
    refetch();
  };

  
  useEffect(() => {
    if(tmpUsers){
      const { allUsers } = tmpUsers;
      setUsers(allUsers)
    }
  }, [tmpUsers])

  useEffect(() => {
    if(users.length > 0 && devicesData.length > 0) {
      const newDeviceArr = [];
      devicesData.map((item) => {
        const { _id, name, mac, ownerId, followerIds } = item;
        const followers = [];
        let owner = {};
        users.map((user) => {
          if (ownerId === user._id) owner = user;
          followerIds.map((fId) => {
            if(fId === user._id) followers.push(user);
          })
        })

        const row = {
          _id,
          name,
          mac,
          owner,
          followers
        }

        newDeviceArr.push(row);
      });

      setDevices(newDeviceArr);
    }
  }, [users, devicesData])

  return (
    <Page title="Device">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Device ({deviceCount})
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/device/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Device
          </Button>
        </Stack>
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DeviceList deviceList={devices} loggedUser={loggedUser} onDelete={(id) => deleteDevice(id)} />
        }
      </Container>
    </Page>
  );
}
