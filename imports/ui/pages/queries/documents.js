import gql from 'graphql-tag';

export const documentsQuery = gql`
    query getDocuments {
        documents {
            _id
            mac,
            name,
            ownerId,
            followerIds,
            createdAt
        }
    }
`;
