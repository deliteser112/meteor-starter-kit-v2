import React from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container, Typography, Stack } from '@mui/material';

// graphql & collections
import { useQuery } from "@apollo/react-hooks";

// import queries
import {usersQuery} from '../queries'

// components
import Page from '../../components/Page';
import UserList from './UserList';

// ----------------------------------------------------------------------

export default function Users() {

  const  { loading, data, refetch } = useQuery(usersQuery);

  refetch();
 
  const users = data && data.allUsers || [];

  return (
    <Page title="User">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User ({users.length})
          </Typography>
        </Stack>
        {loading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <UserList userList={users} />
        }
      </Container>
    </Page>
  );
}
