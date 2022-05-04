// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from "@apollo/react-hooks";

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
import DiceNewForm from './DiceNewForm';

// import queries
import {usersQuery, dicesQuery, actionsQuery} from '../queries'
// ----------------------------------------------------------------------

export default function DiceCreate() {
  const [currentDice, setCurrentDice] = useState(null);
  const [actionList, setActionList] = useState([]);
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const dicesData = useQuery(dicesQuery).data;
  const actionsData = useQuery(actionsQuery).data;

  useEffect(() => {
    if(actionsData) {
      const { actions } = actionsData;
      setActionList(actions);
    }
  }, [actionsData]);

  useEffect(() => {
    if(isEdit && dicesData) {
      const { dices } = dicesData;
      const cDice = dices.find((dice) => dice._id === id);
      setCurrentDice(cDice);
    }
  }, [dicesData, isEdit])

  const  { loading, data, refetch } = useQuery(usersQuery);

  refetch();

  const userList = data && data.allUsers || [];

  const loggedUser = Meteor.user();

  return (
    <Page title={isEdit ? 'Update a Dice' : 'Create a Dice'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update dice' : 'Create a new dice'}
          </Typography>
        </Stack>
        {loading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DiceNewForm isEdit={isEdit} loggedUser={loggedUser} currentDice={currentDice} userList={userList} actionList={actionList} />
        }
      </Container>
    </Page>
  );
}
