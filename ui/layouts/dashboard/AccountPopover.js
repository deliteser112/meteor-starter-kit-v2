import { Roles } from 'meteor/alanning:roles';

import { Meteor } from 'meteor/meteor';

import React, { useRef, useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
// hooks
import useAuth from '../../hooks/useAuth';
// utils
import isOAuthUser from '../../utils/isOAuthUser';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: `/dashboard/profile/my-profile`,
  },
  {
    label: 'Dashboard',
    icon: 'eva:settings-2-fill',
    linkTo: `${PATH_AUTH.root}`,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = () => Meteor.logout();
  const anchorRef = useRef(null);

  const [menuOptions, setMenuOptions] = useState(MENU_OPTIONS);
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    if (user) {
      const { _id, profile, services } = user;
      const isOAuth = isOAuthUser(Object.keys(services));
      setRole(sentenceCase(Roles.getRolesForUser(_id)[0]));
      if (isOAuth) {
        setDisplayName(profile.name);
      } else {
        setDisplayName(`${profile.name.first} ${profile.name.last}`);
      }
      const profileLink = `${PATH_DASHBOARD.profile}/${_id}`;
      const newMenu = [];
      menuOptions.map((item) => {
        const { label } = item;
        if (label !== 'Profile') newMenu.push(item);
        else newMenu.push({ ...item, linkTo: profileLink });
      });
      setMenuOptions(newMenu);
    }
  }, [user]);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {role}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {menuOptions.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
