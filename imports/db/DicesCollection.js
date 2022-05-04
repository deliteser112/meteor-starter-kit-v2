import { Mongo } from 'meteor/mongo';

const dicesCollection = Object.assign(new Mongo.Collection('dices'), {
  save({ did, name, userId, actionIds, coverImg }) {
    const newDiceId = this.insert({
      did,
      name,
      userId,
      actionIds,
      coverImg,
      createdAt: new Date(),
    });
    return this.findOne(newDiceId);
  },
  updateDice({ diceId, did, name, actionIds, coverImg, userId }) {
    const res = this.update(
      { _id: diceId }, 
      { $set: { did, name, actionIds, coverImg, userId }}, 
      {}
    );
    return
  }
});

export { dicesCollection as DicesCollection }
