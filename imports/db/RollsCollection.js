import { Mongo } from 'meteor/mongo';

const rollsCollection = Object.assign(new Mongo.Collection('rolls'), {
  save({ device, dice, results }) {
    const newRollId = this.insert({
      device,
      dice,
      results,
      createdAt: new Date(),
    });
    return this.findOne(newRollId);
  }
});

export { rollsCollection as RollsCollection }
