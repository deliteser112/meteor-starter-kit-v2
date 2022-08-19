import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components
import LoadingScreen from '../components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/analytics" /> },
        { path: 'profile/:userId', element: <Profile /> },
        { path: 'analytics', element: <GeneralApp /> },

        // documents
        { path: 'documents', element: <Documents /> },
        { path: 'documents/create', element: <DocumentCreate /> },
        { path: 'documents/:documentId/edit', element: <DocumentCreate /> },

        // Admin/users
        {
          path: 'users',
          element: (
            <RoleBasedGuard>
              <User />
            </RoleBasedGuard>
          )
        },
        {
          path: 'users/:userId/edit',
          element: (
            <RoleBasedGuard>
              <UserProfile />
            </RoleBasedGuard>
          )
        },

        // Admin/user-settings
        {
          path: 'user-settings',
          element: (
            <RoleBasedGuard>
              <UserSettings />
            </RoleBasedGuard>
          )
        }
      ]
    },
    {
      path: 'auth',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="login" /> },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> }
      ]
    },
    { path: '/verify-email/:token', element: <VerifyEmail /> },
    { path: '/reset-password/:token', element: <NewPassword /> },

    // Main RoutesResetPassword
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'contact-us', element: <ContactPage /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// main pages
const HomePage = Loadable(lazy(() => import('../pages/external_pages/Home')));
const ContactPage = Loadable(lazy(() => import('../pages/external_pages/Contact')));

// others
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const Page404 = Loadable(lazy(() => import('../pages/other/Page404')));

// documents
const Documents = Loadable(lazy(() => import('../pages/dashboard/document')));
const DocumentCreate = Loadable(lazy(() => import('../pages/dashboard/document/DocumentCreate')));

// users
const User = Loadable(lazy(() => import('../pages/dashboard/user')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/user-profile')));

// user settings
const UserSettings = Loadable(lazy(() => import('../pages/dashboard/userSettings')));

const Profile = Loadable(lazy(() => import('../pages/profile')));

// authentications
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/authentication/NewPassword')));
const VerifyEmail = Loadable(lazy(() => import('../pages/authentication/VerifyEmail')));
