import React from 'react';

//
import MAvatar from './MAvatar';
import createAvatar from '../utils/createAvatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ avatarUrl, displayName, ...other }) {
  return (
    <MAvatar
      src={avatarUrl}
      alt={displayName}
      color={avatarUrl ? 'default' : createAvatar(displayName).color}
      {...other}
    >
      {createAvatar(displayName).name}
    </MAvatar>
  );
}
