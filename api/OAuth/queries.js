import { ServiceConfiguration } from 'meteor/service-configuration';

export default {
  oAuthServices: async () => {
    return ServiceConfiguration.configurations
      .find({ enabled: true }, { sort: { service: 1 } })
      .map((document) => document.service);
  },
};
