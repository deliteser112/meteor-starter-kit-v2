## Meteor Starter Kit(:MST)
This template is meteor starter kit for react, graphql, subscription.

[Read the Documentation](https://mst-guide.netlify.app/)

---

**NOTE:** The following represents example `README.md` content for your product. **_The information below should be customized for your product._**

---

### 1. Settings & Configuration

Settings for the app are defined in three files at the root of the project:

- `settings-development.json` contains the settings specific to the `development` environment (i.e., when running the app on your computer).
- `settings-staging.json` contains the settings specific to the `staging` environmnet.
- `settings-production.json` contains the settings specific to the `production` environment.

Each settings file should **_only be used in conjunction with the environment it's intended for_**. Further, each settings file's contents should be restricted to that specific environment (i.e., don't use an API key intended for the `production` environment in `development` and vice-versa—only break this rule when a given service's API key provisioning makes this prohibitive).


## 2.Installation

### npm

```
meteor npm install
```

### yarn

```
yarn
or
yarn install
```

## 3.Start

```sh
npm run dev
```

#### Test Users

When you start the app for the first time in development, we create a set of test users to use when testing different permissions:

| Email Address | Password | Roles | Notes |
|:----------------|:--------:|:-------:|:-------------------------------|
| meteor@admin.com | root | `admin` | Full access to the application |
