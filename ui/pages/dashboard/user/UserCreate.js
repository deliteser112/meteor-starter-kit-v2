import React from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

// graphql & collections
import { useQuery } from "@apollo/react-hooks";

// import queries
import {usersQuery} from '../../queries'

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
// import { _userList } from '../../../_mock';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
// import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  
  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const  { loading, data, refetch } = useQuery(usersQuery);

  refetch();
 
  const users = data && data.allUsers || [];

  return (
    <Page title="Edit user">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.users },
            { name: !isEdit ? 'New user' : capitalCase(name) },
          ]}
        />

        {/* <UserNewEditForm isEdit={isEdit} currentUser={currentUser} /> */}
      </Container>
    </Page>
  );
}
