import { check } from 'meteor/check';
import { DocumentsCollection } from '/imports/db/DocumentsCollection';

Meteor.methods({

  // documents
  'documents.remove'(documentId) {
    check(documentId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const { profile } = Meteor.user();

    const isAdmin = profile.role === 'admin';

    const document = DocumentsCollection.findOne({ _id: documentId, userId: this.userId });

    if (!document && !isAdmin) {
      throw new Meteor.Error('Access denied.');
    }

    DocumentsCollection.remove(documentId);
  },
});
