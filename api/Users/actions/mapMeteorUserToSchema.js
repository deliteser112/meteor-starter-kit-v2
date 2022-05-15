/* eslint-disable consistent-return */

import { Roles } from 'meteor/alanning:roles';
import normalizeMeteorUserData from './normalizeMeteorUserData';

const getActiveRoles = (userName, userId) => {
  try {
    console.log({ 'USERNAME': userName, 'ROLE_STATUS': Roles.userIsInRole(userId, 'admin') });
    return (
      Roles.getAllRoles().map((role) => {
        console.log(role.name, {
          ...role,
          inRole: Roles.userIsInRole(userId, role.name),
        });
          return {
            ...role,
            inRole: Roles.userIsInRole(userId, role.name),
          }
        }
      ) || []
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

    // console.log('QQQ', getActiveRoles(normalizedMeteorUserData._id));

    return {
      _id: normalizedMeteorUserData._id,
      name: normalizedMeteorUserData.profile ? normalizedMeteorUserData.profile.name : { first: normalizedMeteorUserData.username },
      emailAddress: normalizedMeteorUserData.emails[0].address,
      emailVerified: normalizedMeteorUserData.emails[0].verified,
      roles: getActiveRoles(normalizedMeteorUserData.profile.name, normalizedMeteorUserData._id),
      oAuthProvider:
        normalizedMeteorUserData.service !== 'password' ? normalizedMeteorUserData.service : null,
      settings: normalizedMeteorUserData.settings,
    };
  } catch (exception) {
    throw new Error(`[mapMeteorUserToSchema] ${exception.message}`);
  }
};
