import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { useQuery } from "@apollo/react-hooks";

// import queries
// import {documentsQuery, usersQuery} from '../../queries'

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

import DocumentList from './DocumentList';
// sections
import Iconify from '../../../components/Iconify';

// utils
import { fDate } from '../../../utils/formatTime'
// ----------------------------------------------------------------------

export default function Document() {

  return (
    <Page title="Document">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={`Documents`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Documents' }
          ]}
          action={(
            <Button variant="contained" component={RouterLink} to={PATH_DASHBOARD.documentCreate} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Document
            </Button>
          )}
        />
        {/* <DocumentList documentList={documents} loggedUser={loggedUser} onDelete={(id) => deleteDocument(id)} /> */}
      </Container>
    </Page>
  );
}
