import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container, Typography, Stack } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { DocumentsCollection } from '/imports/db/DocumentsCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import {documentsQuery, usersQuery} from '../../queries'

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import DocumentList from './DocumentList';
// sections
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

export default function Document() {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  const loggedUser = Meteor.user();

  const tmpUsers = useQuery(usersQuery).data;
  const  { loading, data, refetch } = useQuery(documentsQuery);

  refetch();

  const { isLoading, documentCount } = useTracker(() => {
    const noDataAvailable = { documentCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('documents');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const documentCount = DocumentsCollection.find({}).count();

    return { documentCount };
  });
 
  const documentData = data && data.documents || [];

  const deleteDocument = (_id) => {
    Meteor.call('documents.remove', _id);
    refetch();
  };

  
  useEffect(() => {
    if(tmpUsers){
      const { allUsers } = tmpUsers;
      setUsers(allUsers)
    }
  }, [tmpUsers])

  useEffect(() => {
    if(users.length > 0 && documentData.length > 0) {
      const newDocumentArr = [];
      documentData.map((item) => {
        const { _id, name, mac, ownerId, followerIds } = item;
        const followers = [];
        let owner = {};
        users.map((user) => {
          if (ownerId === user._id) owner = user;
          followerIds.map((fId) => {
            if(fId === user._id) followers.push(user);
          })
        })

        const row = {
          _id,
          name,
          mac,
          owner,
          followers
        }

        newDocumentArr.push(row);
      });

      setDocuments(newDocumentArr);
    }
  }, [users, documentData])

  return (
    <Page title="Document">
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Documents ({documentCount})
          </Typography>
          <Button variant="contained" component={RouterLink} to={PATH_DASHBOARD.documentCreate} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Document
          </Button>
        </Stack>
        {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DocumentList documentList={documents} loggedUser={loggedUser} onDelete={(id) => deleteDocument(id)} />
        }
      </Container>
    </Page>
  );
}
