import gql from 'graphql-tag';

export const deviceMutation =  gql`
  mutation AddDevice($mac: String!, $name: String!, $ownerId: String!, $followerIds: [String]) {
    addDevice(mac: $mac, name: $name, ownerId: $ownerId, followerIds: $followerIds) {
      _id
    }
  }
`
export const deviceUpdateMutation =  gql`
  mutation UpdateDevice($deviceId: ID!, $mac: String!, $name: String!, $ownerId: String!, $followerIds: [String]) {
    updateDevice(deviceId: $deviceId, mac: $mac, name: $name, ownerId: $ownerId, followerIds: $followerIds) {
      _id
    }
  }
`
  
export const diceMutation =  gql`
  mutation AddDice($did: String!, $name: String!, $userId: String!, $actionIds: [String]!, $coverImg: String) {
    addDice(did: $did, name: $name, userId: $userId, actionIds: $actionIds, coverImg: $coverImg) {
      _id
    }
  }
`

export const diceUpdateMutation =  gql`
  mutation UpdateDice($diceId: ID!, $did: String!, $name: String!, $userId: String!, $actionIds: [String]!, $coverImg: String) {
    updateDice(diceId: $diceId, did: $did, name: $name, userId: $userId, actionIds: $actionIds, coverImg: $coverImg) {
      _id
    }
  }
`

export const actionMutation =  gql`
  mutation AddAction($name: String!, $action: String!, $equation: String!) {
    addAction(name: $name, action: $action, equation: $equation) {
      _id
    }
  }
`

export const actionUpdateMutation =  gql`
  mutation UpdateAction($actionId: ID!, $name: String!, $action: String!, $equation: String!) {
    updateAction(actionId: $actionId, name: $name, action: $action, equation: $equation) {
      _id
    }
  }
`
export const rollMutation =  gql`
  mutation AddRoll($device: String!, $dice: String!) {
    addRoll(device: $device, dice: $dice) {
      _id
    }
  }
`