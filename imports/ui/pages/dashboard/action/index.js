import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactLoading from 'react-loading';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { ActionsCollection } from '/imports/db/ActionsCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {actionsQuery} from '../../queries'

// components
import Page from '../../../components/Page';
import ActionList from './ActionList';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function Actions() {

  const  { loading, data, refetch } = useQuery(actionsQuery);

  refetch();

  const { isLoading, actionCount } = useTracker(() => {
    const noDataAvailable = { actionCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('actions');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const actionCount = ActionsCollection.find({}).count();

    return { actionCount };
  });
 
  const actions = data && data.actions || [];

  const deleteAction = (_id) => {
    Meteor.call('actions.remove', _id);
    refetch();
  };

  return (
    <Page title="Action">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Action ({actionCount})
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/action/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Action
          </Button>
        </Stack>
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <ActionList onDelete={(id) => deleteAction(id)} actionList={actions} />
        }
      </Container>
    </Page>
  );
}
