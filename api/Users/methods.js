import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

Files = new Mongo.Collection('files');

Meteor.methods({
  saveFile: function (buffer) {
    check(buffer, String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    Files.insert({ data: buffer });
  }
});
