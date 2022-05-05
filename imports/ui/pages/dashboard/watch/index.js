import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container, Typography, Stack } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { RollsCollection } from '/imports/db';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {rollsQuery, devicesQuery} from '../../queries'

// components
import Page from '../../../components/Page';
import DeviceWatchList from './DeviceWatchList';

// utils
import getDateFromTimestamp from '../../../utils/getDateFromTimeStamp';
// ----------------------------------------------------------------------

export default function Watch() {
  const [rollHistory, setRollHistory] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [currentDevices, setCurrentDevices] = useState([]);

  const  { loading, data, refetch } = useQuery(rollsQuery);
  const devices = useQuery(devicesQuery).data;

  refetch();

  const { isLoading, rollCount } = useTracker(() => {
    const noDataAvailable = { rollCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('rolls');
    Meteor.subscribe('devices');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const rollCount = RollsCollection.find({}).count();

    return { rollCount };
  });
 
  const rolls = data && data.rolls || [];

  
  useEffect(() => {
    const newWatchList = [];
    rolls.map((item) => {
      const { createdAt, device } = item;
      const diff = getDateFromTimestamp(createdAt);
      currentDevices.map(deviceItem => {
        const { mac } = deviceItem;
        if (diff < 5 && mac === device) newWatchList.push({...item, createdAt: new Date(Number(createdAt)).toDateString(), elapsedTime: diff})
      })
    })

    setRollHistory(newWatchList);
  }, [rolls, currentDevices]);

  useEffect(() => {
    if (devices) {
      setDeviceList(devices.devices);
    }
  }, [devices]);

  const handleChooseDevices = (devices) => {
    setCurrentDevices(devices);
  }

  return (
    <Page title="Roll">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Watch List
          </Typography>
        </Stack>
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DeviceWatchList watchList={rollHistory} deviceList={deviceList} onChooseDevice={handleChooseDevices} />
        }
      </Container>
    </Page>
  );
}

