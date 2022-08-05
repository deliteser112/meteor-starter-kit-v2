import { Meteor } from 'meteor/meteor';
import normalizeMeteorUserData from './normalizeMeteorUserData';
import sendEmail from '../../../modules/server/sendEmail';

const getEmailOptions = (user) => {
  try {
    const firstName = user.profile.name && user.profile.name.first ? user.profile.name.first : user.profile.name || '';
    const supportEmail = 'care@gamesnight.fun';
    const { productName } = Meteor.settings.public;

    return {
      to: user.emails[0].address,
      from: supportEmail,
      // from: Meteor.settings.private.supportEmail,
      subject: `[${Meteor.settings.public.productName}] Welcome, ${firstName}!`,
      template: 'welcome',
      templateVars: {
        title: `Welcome, ${firstName}!`,
        subtitle: `Here's how to get started with ${productName}.`,
        productName,
        firstName,
        welcomeUrl: Meteor.absoluteUrl('dashboard/analytics'), // e.g., returns http://localhost:3000/documents
      },
    };
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail.getEmailOptions] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.user) throw new Error('options.user is required.');
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail.validateOptions] ${exception.message}`);
  }
};

export default (options) => {
  try {
    validateOptions(options);
    const user = normalizeMeteorUserData({ user: options.user });
    const emailOptions = getEmailOptions(user);

    sendEmail(emailOptions).catch((error) => {
      throw new Error(error);
    });
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail] ${exception.message}`);
  }
};
