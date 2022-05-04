import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/graphql';
import '/imports/api/Methods';
import '/imports/api/Publications';

const SEED_FIRSTNAME = "Daniel";
const SEED_LASTNAME = "Pasme";
const SEED_ROLE = "admin";

const SEED_EMAIL = 'daniel@pasme.com.au';
const SEED_PASSWORD = 'root';

Meteor.startup(() => {
  if (!Accounts.findUserByEmail(SEED_EMAIL)) {
    Accounts.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      profile: {
        firstName: SEED_FIRSTNAME,
        lastName: SEED_LASTNAME,
        role: SEED_ROLE
      }
    });
  }
});
