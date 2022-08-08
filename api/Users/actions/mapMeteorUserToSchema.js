/* eslint-disable consistent-return */

import { Roles } from 'meteor/alanning:roles';
import normalizeMeteorUserData from './normalizeMeteorUserData';

const getActiveRoles = (userId) => {
  try {
    return (
      Roles.getAllRoles().map((role) => {
        return {
          ...role,
          inRole: Roles.userIsInRole(userId, role.name),
        };
      }) || []
    );
    // return (
    //   Roles.getAllRoles().map((role) => ({
    //     ...role,
    //     inRole: Roles.userIsInRole(userId, role.name),
    //   })) || []
    // );
  } catch (exception) {
    throw new Error(`[mapMeteorUserToSchema.getActiveRoles] ${exception.message}`);
  }
};

export default (options) => {
  try {
    const normalizedMeteorUserData = normalizeMeteorUserData(options);

    return {
      _id: normalizedMeteorUserData._id,
      name: normalizedMeteorUserData.profile.name || '',
      emailAddress: normalizedMeteorUserData.emails[0].address,
      emailVerified:
        normalizedMeteorUserData.service === 'password'
          ? normalizedMeteorUserData.emails[0].verified
          : true,
      avatarUrl: normalizedMeteorUserData.avatarUrl,
      roles: getActiveRoles(normalizedMeteorUserData._id),
      oAuthProvider:
        normalizedMeteorUserData.service !== 'password' ? normalizedMeteorUserData.service : null,
      settings: normalizedMeteorUserData.settings,
    };
  } catch (exception) {
    throw new Error(`[mapMeteorUserToSchema] ${exception.message}`);
  }
};
