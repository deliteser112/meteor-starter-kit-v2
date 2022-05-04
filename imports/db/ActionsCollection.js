import { Mongo } from 'meteor/mongo';

const actionsCollection = Object.assign(new Mongo.Collection('actions'), {
  save({ name, action, equation, userId }) {
    const newActionId = this.insert({
      name,
      action,
      equation,
      userId,
      createdAt: new Date(),
    });
    return this.findOne(newActionId);
  },
  updateAction({ actionId, name, action, equation, userId }) {
    const res = this.update(
      { _id: actionId }, 
      { $set: { actionId, name, action, equation, userId }}, 
      {}
    );
    return
  }
});

export { actionsCollection as ActionsCollection }
