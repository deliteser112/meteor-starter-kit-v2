import React from 'react';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'dashboard',
        path: '/dashboard/analytics',
        icon: getIcon('eva:pie-chart-2-fill'),
      }
    ]
  },
  {
    subheader: 'User',
    items: [
      {
        title: 'device',
        path: '/dashboard/device',
        icon: getIcon('ic:twotone-on-device-training'),
      },
      {
        title: 'dice',
        path: '/dashboard/dice',
        icon: getIcon('ion:dice-outline'),
      },
      {
        title: 'watch',
        path: '/dashboard/watch',
        icon: getIcon('la:eye'),
      }
    ]
  },
  {
    subheader: 'Admin',
    items: [
      {
        title: 'user',
        path: '/dashboard/user',
        icon: getIcon('gis:globe-users'),
      },
      {
        title: 'action',
        path: '/dashboard/action',
        icon: getIcon('carbon:touch-interaction'),
      },
      {
        title: 'roll',
        path: '/dashboard/roll',
        icon: getIcon('fa6-solid:dice'),
      }
    ]
  },
];

export default navConfig;
