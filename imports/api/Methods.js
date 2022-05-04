import { check } from 'meteor/check';
import { DevicesCollection } from '/imports/db/DevicesCollection';
import { DicesCollection } from '/imports/db/DicesCollection';
import { ActionsCollection } from '/imports/db/ActionsCollection';
import { RollsCollection } from '/imports/db/RollsCollection';

Meteor.methods({

  // devices
  'devices.remove'(deviceId) {
    check(deviceId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const { profile } = Meteor.user();

    const isAdmin = profile.role === 'admin';

    const device = DevicesCollection.findOne({ _id: deviceId, userId: this.userId });

    if (!device && !isAdmin) {
      throw new Meteor.Error('Access denied.');
    }

    DevicesCollection.remove(deviceId);
  },
  
  // dices
  'dices.remove'(diceId) {
    check(diceId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const dice = DicesCollection.findOne({ _id: diceId, userId: this.userId });

    if (!dice) {
      throw new Meteor.Error('Access denied.');
    }

    DicesCollection.remove(diceId);
  },

  // actions
  'actions.remove'(actionId) {
    check(actionId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const action = ActionsCollection.findOne({ _id: actionId, userId: this.userId });

    if (!action) {
      throw new Meteor.Error('Access denied.');
    }

    ActionsCollection.remove(actionId);
  },

  // rolls
  'rolls.remove'(rollId) {
    check(rollId, String);
    RollsCollection.remove(rollId);
  },
});
