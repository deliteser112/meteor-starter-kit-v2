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
import ActionNewForm from './ActionNewForm';

// import queries
import { actionsQuery } from '../queries'
// ----------------------------------------------------------------------

export default function ActionCreate() {
  const [currentAction, setCurrentAction] = useState(null)
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const { data } = useQuery(actionsQuery);

  useEffect(() => {
    if(isEdit && data) {
      const { actions } = data;
      const cAction = actions.find((action) => action._id === id);
      setCurrentAction(cAction);
    }
  }, [isEdit, data])

  return (
    <Page title={isEdit ? 'Update a Action' : 'Create a Action'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update action' : 'Create a new action'}
          </Typography>
        </Stack>
        <ActionNewForm isEdit={isEdit} currentAction={currentAction} />
      </Container>
    </Page>
  );
}
