
import { getCalcuation } from './utilites';

import { DevicesCollection } from '../db/DevicesCollection';
import { DicesCollection } from '../db/DicesCollection';
import { ActionsCollection } from '../db/ActionsCollection';
import { RollsCollection } from '../db/RollsCollection';

// User resolver
export const UserResolvers = {
    Query: {
      async loggedUser(root, args, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        return Meteor.users.findOne(userId);
      },
      async allUsers(root, args, context) {
        return Meteor.users.find({});
      }
    },
    User: {
      email: ( user ) => user.emails[0].address
    }
    
};

// Device resolver
export const DeviceResolvers = {
    Query: {
      async devices(root, args, context) {
        return DevicesCollection.find({});
      },
    },
    Mutation: {
      async addDevice(root, { mac, name, ownerId, followerIds }, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        const isExist = DevicesCollection.findOne({mac})
  
        if(isExist) return null;
        
        return await DevicesCollection.save({ mac, name, ownerId, followerIds, userId });
      },
      async updateDevice(root, { deviceId, mac, name, ownerId, followerIds }, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        await DevicesCollection.updateDevice({ deviceId, mac, name, ownerId, followerIds, userId});
        return;
      }
    }
};

// Dice resolver
export const DiceResolvers = {
    Query: {
      async dices(root, args, context) {
        return DicesCollection.find({});
      },
    },
    Mutation: {
      async addDice(root, { did, name, userId, actionIds, coverImg }, { user }) {
        const uId = user._id;
        if (!uId) {
          return null;
        }
        const isExist = DicesCollection.findOne({did, userId: uId})
  
        if(isExist) return null;
        
        return await DicesCollection.save({ did, name, userId, actionIds, coverImg });
      },
      async updateDice(root, { diceId, did, name, actionIds, coverImg }, { user }) {
        const userId = user._id;
        if (!userId) {
          return null;
        }
        await DicesCollection.updateDice({ diceId, did, name, actionIds, coverImg, userId});
        return;
      }
    }
};

// Action resolver
export const ActionResolvers = {
  Query: {
    async actions(root, args, context) {
      return ActionsCollection.find({});
    },
  },
  Mutation: {
    async addAction(root, { name, action, equation }, { user }) {
      const userId = user._id;

      if (!userId) {
        return null;
      }
      const isExist = ActionsCollection.findOne({name})

      if(isExist) return null;
      
      return await ActionsCollection.save({ name, action, equation, userId });
    },
    async updateAction(root, { actionId, name, action, equation }, { user }) {
      const userId = user._id;
      if (!userId) {
        return null;
      }
      await ActionsCollection.updateAction({ actionId, name, action, equation, userId});
      return;
    }
  },
  Action: {
    user({ userId }) {
      return Meteor.users.findOne(userId);
    },
  },
};

// Roll resolver
export const RollResolvers = {
  Query: {
    async rolls(root, args, context) {
      return RollsCollection.find({});
    },
    async rollsByMAC(root, { device }, context) {
      return RollsCollection.find({ device });
    }
  },
  Mutation: {
    async addRoll(root, { device, dice }, context) {
      const diceIds = dice.split(',');
      const dices = DicesCollection.find({
          did: { $in: diceIds}
      }).fetch();

      const actions = ActionsCollection.find({}).fetch();

      const results = [];
      dices.map((item) => {
        const { actionIds, coverImg, name } = item;
        const actionNames = [];
        actionIds.map((aId) => {
          actions.map((item) => {
            const { _id, name } = item;
            if(aId === _id) actionNames.push(name);
          });
        });
        let equation = "";
        actionNames.map(action => {
          equation += action;
        });

        const {eqs, sum} = getCalcuation(actionNames);

        results.push({
          coverImg,
          name,
          result: sum,
          calculation: eqs,
          equation
        })
      });
      
      return await RollsCollection.save({ device, dice, results });
    }
  }
};