import gql from 'graphql-tag';

export const sendVerificationEmailMutation =  gql`
    mutation sendVerificationEmail {
        sendVerificationEmail {
            _id
        }
    }
`