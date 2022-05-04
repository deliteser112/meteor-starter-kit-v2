
export const UserSchema = `
    type Query {
      loggedUser: User
      allUsers: [User]
    } 
    
    type User {
      _id: String
      email: String
      profile: Profile
    }

    type Profile {
      firstName: String
      lastName: String
      role: String
    }

    type Mutation {
      createUser( email: String!, password: String! ): User
    }
    
`;

export const DeviceSchema = `
  type Query {
    devices: [Device]
  } 
  
  type Mutation {
    addDevice(mac: String!, name: String!, ownerId: String!, followerIds: [String]): Device
    updateDevice(deviceId: ID!, mac: String!, name: String!, ownerId: String, followerIds: [String]): Device
  }
  
  type Device {
    _id: ID!
    mac: String
    name: String
    ownerId: String
    followerIds: [String]
    createdAt: String
  }
`;

export const DiceSchema = `
  type Query {
    dices: [Dice]
  } 
  
  type Mutation {
    addDice(did: String!, name: String!, userId: String!, actionIds: [String]!, coverImg: String): Dice
    updateDice(diceId: ID!, did: String!, name: String!, userId: String!, actionIds: [String]!, coverImg: String): Dice
  }
  
  type Dice {
    _id: ID!
    did: String
    name: String
    userId: String
    actionIds: [String]
    coverImg: String
    createdAt: String
  }
`;

export const ActionSchema = `
  type Query {
    actions: [Action]
  } 
  
  type Mutation {
    addAction(name: String!, action: String!, equation: String!): Action
    updateAction(actionId: ID!, name: String!, action: String!, equation: String!): Action
  }
  
  type Action {
    _id: ID!
    action: String!
    name: String!
    equation: String!
    user: User
    createdAt: String
  }
`;

export const RollSchema = `
  type Query {
    rolls: [Roll]
    rollsByMAC(device: String!): [Roll]
  } 
  
  type Mutation {
    addRoll(device: String!, dice: String!): Roll
  }

  type Roll {
    _id: ID!
    device: String
    dice: String
    results: [Result]
    createdAt: String
  }

  type Result {
    coverImg: String
    name: String
    result: String
    calculation: String
    equation: String
  }
  
 
`;