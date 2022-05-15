/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

export default function Document() {
  return (
    <Page title="Document">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Documents"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Documents' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.documentCreate}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Document
            </Button>
          }
        />
        {/* <DocumentList documentList={documents} loggedUser={loggedUser} onDelete={(id) => deleteDocument(id)} /> */}
      </Container>
    </Page>
  );
}
