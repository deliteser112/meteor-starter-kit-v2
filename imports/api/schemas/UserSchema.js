
const UserSchema = `
    type Query {
      loggedUser: User
      allUsers: [User]
      oAuthServices(services: [String]): [String]
    } 
    
    type User {
      _id: String
      email: String
      verified: Boolean
      profile: Profile
    }

    type Profile {
      firstName: String
      lastName: String
      role: String
    }

    type Mutation {
      createUser( email: String!, password: String! ): User
      sendVerificationEmail(userId: String): User
    }
    
`;

export default UserSchema;