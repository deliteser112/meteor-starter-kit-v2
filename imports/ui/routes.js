import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
// guards
import GuestGuard from "./guards/GuestGuard";
import AuthGuard from "./guards/AuthGuard";
import OwnerBasedGuard from "./guards/OwnerBasedGuard";
import RoleBasedGuard from "./guards/RoleBasedGuard";

// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";

// others
import DieAnalytics from "./pages/other/DieAnalytics";
import NotFound from "./pages/other/Page404";
// import Maintenance from "./pages/other/Maintenance";

// devices
import Device from "./pages/device";
import DeviceCreate from "./pages/device/DeviceCreate";

// watch
import Watch from "./pages/watch";

// dices
import Dice from "./pages/dice";
import DiceCreate from "./pages/dice/DiceCreate";

// users
import User from "./pages/user";

// actions
import Action from "./pages/action";
import ActionCreate from "./pages/action/ActionCreate";

// rolls
import Roll from "./pages/roll";

import Profile from "./pages/profile";

import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";

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
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
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
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
