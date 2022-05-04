import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { DiceCard } from '../../sections/@dashboard/dice';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { DicesCollection } from '/imports/db/DicesCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import { dicesQuery, usersQuery, actionsQuery } from '../queries'

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Dices() {
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);

  const [dices, setDices] = useState([]);

  const tmpUsers = useQuery(usersQuery).data;
  const tmpActions = useQuery(actionsQuery).data;

  const  { loading, data, refetch } = useQuery(dicesQuery);

  refetch();

  const { isLoading, diceCount } = useTracker(() => {
    const noDataAvailable = { diceCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('dices');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const diceCount = DicesCollection.find({}).count();

    return { diceCount };
  });
  
  const dicesData = data && data.dices || [];

  const deleteDice = (id) => {
    Meteor.call('dices.remove', id);
    refetch();
  };

  useEffect(() => {
    if(tmpUsers && tmpActions){
      const { allUsers } = tmpUsers;
      const { actions } = tmpActions;
      setUsers(allUsers);
      setActions(actions);
    }
  }, [tmpUsers, tmpActions])

  useEffect(() => {
    if(users.length > 0 && dicesData.length > 0 && actions.length > 0) {
      const newDiceArr = [];
      dicesData.map((item) => {
        const { _id, name, did, userId, actionIds, coverImg, createdAt } = item;
        const actionItems = [];
        let owner = {};
        users.map((user) => {
          if (userId === user._id) owner = user;
        })
        actionIds.map((aId) => {
          actions.map((action) => {
            if(aId === action._id) actionItems.push(action);
          })
        })

        const row = {
          _id,
          name,
          did,
          coverImg,
          owner,
          actionItems,
          createdAt
        }

        newDiceArr.push(row);
      });

      setDices(newDiceArr);
    }
  }, [users, actions, dicesData])
  return (
    <Page title="Dice">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Dice ({diceCount})
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/dice/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add dice
          </Button>
        </Stack>

        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
        <Grid container spacing={3}>
          {dices.map((dice, index) => (
            <DiceCard key={dice._id} dice={dice} index={index} onDelete={(id) => deleteDice(id)} />
          ))}
        </Grid>}
      </Container>
    </Page>
  );
}
