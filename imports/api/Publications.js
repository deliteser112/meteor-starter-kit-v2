import { Meteor } from 'meteor/meteor';
import { DocumentsCollection } from '/imports/db';

Meteor.publish('loggedInUser', function publishUsers() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('users', function publishUsers() {
  return Meteor.users.find({});
});

Meteor.publish('documents', function publishDocuments() {
  return DocumentsCollection.find({});
});

// Meteor.publish('documents', function publishDocuments() {
//   return DocumentsCollection.find(
//     { userId: this.userId },
//     { fields: { _id: 1, userId: 1 } }
//   );
// });