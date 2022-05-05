
import { DocumentsCollection } from '../../db/DocumentsCollection';

// Document resolver
const DocumentResolvers = {
    Query: {
      async documents(root, args, context) {
        return DocumentsCollection.find({});
      },
    },
    Mutation: {
      async addDocument(root, { mac, name, ownerId, followerIds }, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        const isExist = DocumentsCollection.findOne({mac})
  
        if(isExist) return null;
        
        return await DocumentsCollection.save({ mac, name, ownerId, followerIds, userId });
      },
      async updateDocument(root, { deviceId, mac, name, ownerId, followerIds }, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        await DocumentsCollection.updateDocument({ deviceId, mac, name, ownerId, followerIds, userId});
        return;
      }
    }
};

export default DocumentResolvers;