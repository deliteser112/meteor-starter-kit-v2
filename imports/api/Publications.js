import { Meteor } from 'meteor/meteor';
import { DevicesCollection, DicesCollection, ActionsCollection, RollsCollection } from '/imports/db';

Meteor.publish('users', function publishDevices() {
  return Meteor.users.find({});
});

Meteor.publish('devices', function publishDevices() {
  return DevicesCollection.find({});
});

Meteor.publish('dices', function publishDices() {
  return DicesCollection.find({});
});

Meteor.publish('actions', function publishActions() {
  return ActionsCollection.find({});
});

Meteor.publish('rolls', function publishRolls() {
  return RollsCollection.find({});
});

// Meteor.publish('rolls', function publishRolls() {
//   return RollsCollection.find(
//     { userId: this.userId },
//     { fields: { _id: 1, userId: 1 } }
//   );
// });