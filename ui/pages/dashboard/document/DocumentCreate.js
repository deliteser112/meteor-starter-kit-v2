// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from "@apollo/react-hooks";
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';

// components
import Page from '../../../components/Page';
import DocumentNewForm from './DocumentNewForm';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// import queries
import {usersQuery, documentsQuery} from '../../queries'
// ----------------------------------------------------------------------

export default function DocumentCreate() {
  const [currentDocument, setCurrentDocument] = useState(null)
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const documentsData = useQuery(documentsQuery).data;

  useEffect(() => {
    if(isEdit && documentsData) {
      const { documents } = documentsData;
      const cDocument = documents.find((document) => document._id === id);
      setCurrentDocument(cDocument);
    }
  }, [documentsData, isEdit])

  const  { loading, data, refetch } = useQuery(usersQuery);

  useTracker(() => {
    Meteor.subscribe('users');
  });

  refetch();

  const userList = data && data.allUsers || [];

  const loggedUser = Meteor.user();

  return (
    <Page title={isEdit ? 'Update a Document' : 'Create a Document'}>
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={isEdit ? 'Update document' : 'Create a new document'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Documents', href: PATH_DASHBOARD.documents },
            { name: isEdit ? 'Edit Document' : 'New Document' }
          ]}
        />
        {loading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DocumentNewForm isEdit={isEdit} loggedUser={loggedUser} currentDocument={currentDocument} userList={userList} />
        }
      </Container>
    </Page>
  );
}
