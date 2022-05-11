import gql from 'graphql-tag';

export const usersQuery = gql`
    query getUsers {
        allUsers {
            _id,
            email,
            verified,
            profile {
                firstName,
                lastName,
                role
            }
        }
    }
`;

export const oAuthServicesQuery = gql`
    query oAuthServices($services: [String]) {
        oAuthServices(services: $services)
    }
`;
