// User resolver
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Accounts } from 'meteor/accounts-base';

const UserResolvers = {
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
      },
      async oAuthServices(root, args, context) {
        console.log('Here is oAuthServices');
        return ServiceConfiguration.configurations
          .find({ enabled: true }, { sort: { service: 1 } })
          .map((document) => document.service);
      }
    },
    User: {
      email: ( user ) => user.emails[0].address,
      verified: ( user ) => user.emails[0].verified
    },
    Mutation: {
      async sendVerificationEmail(root, args, context) {
        Accounts.sendVerificationEmail(context.user._id);
        return {
          _id: context.user._id,
        };
      }
    }
    
};

export default UserResolvers;
