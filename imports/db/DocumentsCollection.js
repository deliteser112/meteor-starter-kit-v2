import { Mongo } from 'meteor/mongo';

const documentsCollection = Object.assign(new Mongo.Collection('documents'), {
  save({ mac, name, ownerId, followerIds, userId }) {
    const newDeviceId = this.insert({
      mac,
      name,
      ownerId,
      followerIds,
      userId,
      createdAt: new Date(),
    });
    return this.findOne(newDeviceId);
  },
  updateDocument({ deviceId, mac, name, ownerId, followerIds, userId }) {
    const res = this.update(
      { _id: deviceId }, 
      { $set: { mac, name, ownerId, followerIds, userId }}, 
      {}
    );
    return
  }
});

export { documentsCollection as DocumentsCollection }
