import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// main pages
import HomePage from '../pages/external_pages/Home';
import ContactPage from '../pages/external_pages/Contact';

// others
import GeneralApp from '../pages/dashboard/GeneralApp';
import Page404 from '../pages/other/Page404';

// documents
import Documents from '../pages/dashboard/document';
import DocumentCreate from '../pages/dashboard/document/DocumentCreate';

// users
import User from '../pages/dashboard/user';
import UserProfile from '../pages/dashboard/user-profile';

// user settings
import UserSettings from '../pages/dashboard/userSettings';

import Profile from '../pages/profile';

// authentications
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import ResetPassword from '../pages/authentication/ResetPassword';
import NewPassword from '../pages/authentication/NewPassword';
import VerifyEmail from '../pages/authentication/VerifyEmail';

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
