
export const UserSchema = `
    type Query {
      loggedUser: User
      allUsers: [User]
    } 
    
    type User {
      _id: String
      email: String
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

export const DocumentSchema = `
  type Query {
    documents: [Document]
  } 
  
  type Mutation {
    addDocument(mac: String!, name: String!, ownerId: String!, followerIds: [String]): Document
    updateDocument(deviceId: ID!, mac: String!, name: String!, ownerId: String, followerIds: [String]): Document
  }
  
  type Document {
    _id: ID!
    mac: String
    name: String
    ownerId: String
    followerIds: [String]
    createdAt: String
  }
`;
