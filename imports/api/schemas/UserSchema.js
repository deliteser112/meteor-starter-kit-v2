
const UserSchema = `
    type Query {
      loggedUser: User
      allUsers: [User]
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
    }
    
`;

export default UserSchema;