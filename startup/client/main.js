import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// import { startGraphQLClient } from 'meteor/quave:graphql/client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { MeteorAccountsLink } from 'meteor/apollo';

import { ApolloProvider } from '@apollo/react-hooks';

// const apolloClient = startGraphQLClient({ connectToDevTools: true });

// import main component
import App from '../../ui/App';

const client = new ApolloClient({
  link: ApolloLink.from([
    new MeteorAccountsLink(),
    new HttpLink({
      uri: '/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('meteor-root'),
  );
});
