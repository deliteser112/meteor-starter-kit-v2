import React from 'react';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';

// import queries
import { useQuery } from '@apollo/react-hooks';
// @mui
import { Button, Container } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import DocumentNewForm from './DocumentNewForm';

// queries
import { editDocument as editDocumentQuery } from '../../../_queries/Documents.gql';
// ----------------------------------------------------------------------

export default function Document() {
  const { documentId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editDocumentQuery, { variables: { _id: documentId } });
  const currentDocument = (isEdit && data && data.document) || {};
  return (
    <Page title="Document">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Documents"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Documents', href: PATH_DASHBOARD.document.root },
            { name: isEdit ? 'Edit Documet' : 'New Document' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.document.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <DocumentNewForm currentDocument={currentDocument} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
