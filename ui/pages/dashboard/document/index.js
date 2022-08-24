import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

import { Cloudinary } from 'meteor/socialize:cloudinary';

// import queries
import { useQuery, useMutation } from '@apollo/react-hooks';
// @mui
import { Button, Container, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import DocumentList from './DocumentList';

// queries & mutations
import { documents as documentsQuery } from '../../../_queries/Documents.gql';
import { removeDocument as removeDocumentMutation } from '../../../_mutations/Documents.gql';
// ----------------------------------------------------------------------

export default function Document() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeDocument] = useMutation(removeDocumentMutation);

  const { loading, data } = useQuery(documentsQuery);

  const documents = (data && data.documents) || [];

  const deleteDocument = (_id) => {
    const deleteDoc = documents.find((doc) => doc._id === _id);
    const public_id = deleteDoc && deleteDoc.cover && deleteDoc.cover.public_id;
    removeDocument({
      variables: {
        _id
      },
      refetchQueries: [{ query: documentsQuery }]
    }).then(async (res) => {
      if (public_id) {
        await Cloudinary.delete(public_id);

        enqueueSnackbar('Deleted successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
      }
    });
  };

  return (
    <Page title="Document">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Documents"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Documents' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.document.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Document
            </Button>
          }
        />
        <DocumentList isLoading={loading} documentList={documents} onDelete={(id) => deleteDocument(id)} />
      </Container>
    </Page>
  );
}
