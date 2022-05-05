
import { DocumentsCollection } from '../db/DocumentsCollection';

// User resolver
export const UserResolvers = {
    Query: {
      async loggedUser(root, args, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        return Meteor.users.findOne(userId);
      },
      async allUsers(root, args, context) {
        return Meteor.users.find({});
      }
    },
    User: {
      email: ( user ) => user.emails[0].address,
      verified: ( user ) => user.emails[0].verified
    }
    
};

// Document resolver
export const DocumentResolvers = {
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
