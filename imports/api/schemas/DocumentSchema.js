
const DocumentSchema = `
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

export default DocumentSchema;
