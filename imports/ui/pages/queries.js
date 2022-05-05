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

export const documentsQuery = gql`
    query getDocuments {
        documents {
            _id
            mac,
            name,
            ownerId,
            followerIds
        }
    }
`;
