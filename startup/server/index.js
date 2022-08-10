import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Cloudinary } from 'meteor/socialize:cloudinary';

import './accounts';
import './api';
import './browserPolicy';
import './email';
import './graphql';

const SEED_FIRSTNAME = 'Meteor';
const SEED_LASTNAME = 'Admin';

const SEED_EMAIL = 'meteor@admin.com';
const SEED_PASSWORD = 'root';

const { cloud_name, api_key, api_secret } = Meteor.settings.private.cloudinary;

Cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

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
          last: SEED_LASTNAME
        }
      }
    });
  }

  // Rules are bound to the connection from which they are are executed. This means you have a userId available as this.userId if there is a logged in user. Throw a new Meteor.Error to stop the method from executing and propagate the error to the client. If rule is not set a standard error will be thrown.
  Cloudinary.rules.delete = function (publicId) {
    if (!this.userId && !publicId) throw new Meteor.Error('Not Authorized', "Sorry, you can't do that!");
  };

  Cloudinary.rules.sign_upload = function () {
    if (!this.userId) throw new Meteor.Error('Not Authorized', "Sorry, you can't do that!");
  };

  Cloudinary.rules.private_resource = function (publicId) {
    if (!this.userId && !publicId) throw new Meteor.Error('Not Authorized', "Sorry, you can't do that!");
  };

  Cloudinary.rules.download_url = function (publicId) {
    if (!this.userId && !publicId) throw new Meteor.Error('Not Authorized', "Sorry, you can't do that!");
  };
});
