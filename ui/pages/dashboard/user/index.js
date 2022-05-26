import React from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container } from '@mui/material';

// graphql & collections
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries & mutations
import { users as usersQuery } from '../../../_queries/Users.gql';
import { removeUser as removeUserMutation } from '../../../_mutations/Users.gql';

// components
import Page from '../../../components/Page';
import UserList from './UserList';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function Users() {
  const [removeUser] = useMutation(removeUserMutation);

  const { loading, data } = useQuery(usersQuery);

  const users = (data && data.users && data.users.users) || [];

  console.log('USERS:', users);

  const handleDeleteUser = (_id) => {
    removeUser({
      variables: {
        _id,
      },
      refetchQueries: [{ query: usersQuery }]
    });
  };

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Users"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Users' }]}
        />
        {loading ? (
          <ReactLoading className="loading-icons" type="spin" color="grey" height={30} width={30} />
        ) : (
          <UserList userList={users} onDelete={handleDeleteUser} />
        )}
      </Container>
    </Page>
  );
}
