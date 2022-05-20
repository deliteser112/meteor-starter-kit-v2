// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  analytics: path(ROOTS_DASHBOARD, '/analytics'),
  profile: path(ROOTS_DASHBOARD, '/profile'),

  // documents
  documents: path(ROOTS_DASHBOARD, '/documents'),
  documentCreate: path(ROOTS_DASHBOARD, '/documents/create'),

  // users
  users: path(ROOTS_DASHBOARD, '/users'),

  // userSettings
  userSettings: path(ROOTS_DASHBOARD, '/user-settings'),

  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied')
};
