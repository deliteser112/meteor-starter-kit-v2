import { Mongo } from 'meteor/mongo';

const devicesCollection = Object.assign(new Mongo.Collection('devices'), {
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
  updateDevice({ deviceId, mac, name, ownerId, followerIds, userId }) {
    const res = this.update(
      { _id: deviceId }, 
      { $set: { mac, name, ownerId, followerIds, userId }}, 
      {}
    );
    return
  }
});

export { devicesCollection as DevicesCollection }
