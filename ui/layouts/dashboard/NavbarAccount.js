import { Roles } from 'meteor/alanning:roles';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import MyAvatar from '../../components/MyAvatar';
// utils
import isOAuthUser from '../../utils/isOAuthUser';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  useEffect(() => {
    if (user) {
      const { _id, profile, services } = user;
      const isOAuth = isOAuthUser(Object.keys(services));
      setRole(sentenceCase(Roles.getRolesForUser(_id)[0]));
      setUserId(_id);
      if (isOAuth) {
        setDisplayName(profile.name);
      } else {
        setDisplayName(`${profile.name.first} ${profile.name.last}`);
      }
    }
  }, [user]);
  return (
    <Link underline="none" color="inherit" component={RouterLink} to={`${PATH_DASHBOARD.profile}/${userId}`}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
