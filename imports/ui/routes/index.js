import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
// guards
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
// import OwnerBasedGuard from "../guards/OwnerBasedGuard";
import RoleBasedGuard from "../guards/RoleBasedGuard";

// layouts
import MainLayout from "../layouts/main";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";

// main pages
import HomePage from "../pages/external_pages/Home";
import ContactPage from "../pages/external_pages/Contact";

// others
import DieAnalytics from "../pages/other/DieAnalytics";
import NotFound from "../pages/other/Page404";
// import Maintenance from "./pages/other/Maintenance";

// devices
import Device from "../pages/dashboard/device";
import DeviceCreate from "../pages/dashboard/device/DeviceCreate";

// watch
import Watch from "../pages/dashboard/watch";

// dices
import Dice from "../pages/dashboard/dice";
import DiceCreate from "../pages/dashboard/dice/DiceCreate";

// users
import User from "../pages/dashboard/user";

// actions
import Action from "../pages/dashboard/action";
import ActionCreate from "../pages/dashboard/action/ActionCreate";

// rolls
import Roll from "../pages/dashboard/roll";

import Profile from "../pages/profile";

// authentications
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ResetPassword from '../pages/authentication/ResetPassword';
import NewPassword from '../pages/authentication/NewPassword';
import VerifyCode from '../pages/authentication/VerifyCode';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: "/", element: <Navigate to="/dashboard/analytics" /> },
        { path: "profile/:userId", element: <Profile /> },
        { path: "analytics", element: <DieAnalytics /> },
        { path: "device", element: <Device /> },
        { path: "device/create", element: <DeviceCreate /> },
        { 
          path: "device/:id/edit", 
          element: (
            // <OwnerBasedGuard>
              <DeviceCreate />
            // </OwnerBasedGuard>
          ) 
        },
        { path: "dice", element: <Dice /> },
        { path: "dice/create", element: <DiceCreate /> },
        { path: "dice/:id/edit", element: <DiceCreate /> },

        { path: "watch", element: <Watch /> },
        // Admin
        { 
          path: "user", 
          element: (
            <RoleBasedGuard>
              <User />
            </RoleBasedGuard>
          ) 
        },
        { 
          path: "action", 
          element: (
            <RoleBasedGuard>
              <Action />
            </RoleBasedGuard>
          ) 
        },
        { 
          path: "action/create", 
          element: (
            <RoleBasedGuard>
              <ActionCreate />
            </RoleBasedGuard>
          ) 
        },
        { 
          path: "action/:id/edit", 
          element: (
            <RoleBasedGuard>
              <ActionCreate />
            </RoleBasedGuard>
          ) 
        },
        { 
          path: "roll", 
          element: (
            <RoleBasedGuard>
              <Roll />
            </RoleBasedGuard>
          )  
        },
      ],
    },
    {
      path: "auth",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="login" /> },
        { 
          path: "login", 
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: "register", 
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ) 
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },
    // Main RoutesResetPassword
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'contact-us', element: <ContactPage /> }
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
