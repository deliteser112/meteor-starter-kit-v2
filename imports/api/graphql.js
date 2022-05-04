import { ApolloServer } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import { getUser } from 'meteor/apollo'

const log = error => console.error('GraphQL server error', error);

// schemas
import { UserSchema, DeviceSchema, DiceSchema, ActionSchema, RollSchema } from './schemas';

// resolvers
import { UserResolvers, DeviceResolvers, DiceResolvers, ActionResolvers, RollResolvers } from './resolvers';


const server = new ApolloServer({
  typeDefs: [UserSchema, DeviceSchema, DiceSchema, ActionSchema, RollSchema],
  resolvers: [UserResolvers, DeviceResolvers, DiceResolvers, ActionResolvers, RollResolvers],
  context: async ({req}) => ({user: await getUser(req.headers.authorization)}),
  log
})

const app = WebApp.connectHandlers;

async function startGraphQLServer() {
  await server.start()

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: true
  })
}

await startGraphQLServer();

app.use('/graphql', (req, res) => {
  if (req.method === 'GET') {
    res.end()
  }
})

