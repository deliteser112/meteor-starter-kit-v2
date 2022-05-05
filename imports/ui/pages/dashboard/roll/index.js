import React from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container, Typography, Stack } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { RollsCollection } from '/imports/db/RollsCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {rollsQuery} from '../../queries'

// components
import Page from '../../../components/Page';
import RollList from './RollList';

// ----------------------------------------------------------------------

export default function Rolls() {

  const  { loading, data, refetch } = useQuery(rollsQuery);

  refetch();

  const { isLoading, rollCount } = useTracker(() => {
    const noDataAvailable = { rollCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('rolls');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const rollCount = RollsCollection.find({}).count();

    return { rollCount };
  });
 
  const rolls = data && data.rolls || [];

  const deleteRoll = (_id) => {
    Meteor.call('rolls.remove', _id);
    refetch();
  };

  const handleMultiDelete = (ids) => {
    console.log('Here is delete', ids);
    ids.map(id => {
      Meteor.call('rolls.remove', id);
    })
    refetch();
  };

  return (
    <Page title="Roll">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Roll ({rollCount})
          </Typography>
        </Stack>
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <RollList rollList={rolls} onDelete={(id) => deleteRoll(id)} onMultiDelete={(ids) => handleMultiDelete(ids)}/>
        }
      </Container>
    </Page>
  );
}
