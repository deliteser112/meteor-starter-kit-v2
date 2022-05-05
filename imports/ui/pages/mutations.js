import gql from 'graphql-tag';

export const documentMutation =  gql`
  mutation AddDocument($mac: String!, $name: String!, $ownerId: String!, $followerIds: [String]) {
    addDocument(mac: $mac, name: $name, ownerId: $ownerId, followerIds: $followerIds) {
      _id
    }
  }
`
export const documentUpdateMutation =  gql`
  mutation UpdateDocument($deviceId: ID!, $mac: String!, $name: String!, $ownerId: String!, $followerIds: [String]) {
    updateDocument(deviceId: $deviceId, mac: $mac, name: $name, ownerId: $ownerId, followerIds: $followerIds) {
      _id
    }
  }
`