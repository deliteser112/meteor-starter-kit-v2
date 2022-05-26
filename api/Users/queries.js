import queryUsers from './actions/queryUsers';
import queryUser from './actions/queryUser';
import exportUserData from './actions/exportUserData';
// import mapMeteorUserToSchema from './actions/mapMeteorUserToSchema';

export default {
  users: async (parent, args, context) => {
    const users = await queryUsers({ currentUser: context.user });
    return users;
  },
  user: async (parent, args, context) => {
    const userIdFromParentQuery = parent && parent.userId;
    return queryUser({
      userIdToQuery: userIdFromParentQuery || args._id || context.user._id
    });
  },
  exportUserData: async (parent, args, { user }) =>
    exportUserData({
      user
    })
};
