
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useParams } from 'react-router-dom';

// material
import {  Card, Container } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { DevicesCollection } from '/imports/db/DevicesCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {devicesQuery, usersQuery} from '../queries'

// components
import Page from '../../components/Page';
import ProfileCover from './ProfileCover';
import DeviceList from '../device/DeviceList';

import account from '../../_mock/account';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { userId } = useParams();
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

  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

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

        if(ownerId === userId) newDeviceArr.push(row);
      });

      setDevices(newDeviceArr);
    }
  }, [users, devicesData])

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
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DeviceList deviceList={devices} onDelete={(id) => deleteDevice(id)} />
        }
      </Container>
    </Page>
  );
}
