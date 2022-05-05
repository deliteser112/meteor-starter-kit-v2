// User resolver
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
      }
    },
    User: {
      email: ( user ) => user.emails[0].address,
      verified: ( user ) => user.emails[0].verified
    }
    
};

export default UserResolvers;