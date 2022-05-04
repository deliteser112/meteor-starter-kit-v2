import gql from 'graphql-tag';

export const usersQuery = gql`
    query getUsers {
        allUsers {
            _id,
            email,
            profile {
                firstName,
                lastName,
                role
            }
        }
    }
`;

export const devicesQuery = gql`
    query getDevices {
        devices {
            _id
            mac,
            name,
            ownerId,
            followerIds
        }
    }
`;

export const dicesQuery = gql`
    query getDices {
        dices {
            _id
            did,
            name,
            userId,
            actionIds,
            coverImg,
            createdAt
        }
    }
`;

export const actionsQuery = gql`
    query getActions {
        actions {
            _id
            action,
            name,
            equation
        }
    }
`;

export const rollsQuery = gql`
    query getRolls {
        rolls {
            _id,
            device,
            dice,
            results {
                coverImg,
                name,
                result,
                calculation,
                equation
            },
            createdAt
        }
    }
`;

export const rollsByMACQuery = gql`
    query getRollsByMAC($device: String!) {
        rollsByMAC(device: $device) {
            _id,
            device,
            dice,
            results {
                coverImg,
                name,
                result,
                calculation,
                equation
            },
            createdAt
        }
    }
`;