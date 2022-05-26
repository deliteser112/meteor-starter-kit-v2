import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import './accounts';
import './api';
import './browserPolicy';
import './email';
import './graphql';

const SEED_FIRSTNAME = 'Meteor';
const SEED_LASTNAME = 'Admin';

const SEED_EMAIL = 'meteor@admin.com';
const SEED_PASSWORD = 'root';

Meteor.startup(() => {
  if (!Accounts.findUserByEmail(SEED_EMAIL)) {
    Roles.createRole('user');
    Roles.createRole('admin');
    Accounts.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      profile: {
        name: {
          first: SEED_FIRSTNAME,
          last: SEED_LASTNAME,
        },
      },
    });
  }
});
