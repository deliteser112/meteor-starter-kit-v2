import { ApolloServer } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';
import schema from './api';

// -----------------

const server = new ApolloServer({
  schema,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
  uploads: false,
});

const app = WebApp.connectHandlers;

async function startGraphQLServer() {
  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: true,
  });
}

await startGraphQLServer();

app.use('/graphql', (req, res) => {
  if (req.method === 'GET') {
    res.end();
  }
});
