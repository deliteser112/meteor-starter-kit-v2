import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container } from '@mui/material';

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
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

import DocumentList from './DocumentList';
// sections
import Iconify from '../../../components/Iconify';

// utils
import { fDate } from '../../../utils/formatTime'
// ----------------------------------------------------------------------

export default function Document() {
  console.log('Here is setting:', Meteor.isDevelopment, Meteor.settings, process.env.MAIL_URL);
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
        const { _id, name, mac, ownerId, followerIds, createdAt } = item;
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
          followers,
          createdAt: fDate(new Date())
        }

        newDocumentArr.push(row);
      });

      setDocuments(newDocumentArr);
    }
  }, [users, documentData])

  return (
    <Page title="Document">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={`Documents (${documentCount})`}
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
        <DocumentList documentList={documents} loggedUser={loggedUser} onDelete={(id) => deleteDocument(id)} />
      </Container>
    </Page>
  );
}
