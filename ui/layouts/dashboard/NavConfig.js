import React from 'react';
// component
import Iconify from '../../components/Iconify';

import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'dashboard',
        path: `${PATH_DASHBOARD.analytics}`,
        icon: getIcon('eva:pie-chart-2-fill'),
      },
      {
        title: 'documents',
        path: `${PATH_DASHBOARD.documents}`,
        icon: getIcon('gala:file-doc'),
      },
    ],
  },
  {
    subheader: 'Admin',
    items: [
      {
        title: 'user',
        path: `${PATH_DASHBOARD.users}`,
        icon: getIcon('gis:globe-users'),
      },
      {
        title: 'user settings',
        path: `${PATH_DASHBOARD.userSettings}`,
        icon: getIcon('fluent:people-settings-28-regular'),
      },
    ],
  },
];

export default navConfig;
