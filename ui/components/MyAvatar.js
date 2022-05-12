import React from 'react';

//
import MAvatar from './MAvatar';
import createAvatar from '../utils/createAvatar';

import account from '../_mock/account';
// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  return (
    <MAvatar
      src={account.photoURL}
      alt={account.displayName}
      color={account.photoURL ? 'default' : createAvatar(account.displayName).color}
      {...other}
    >
      {createAvatar(account.displayName).name}
    </MAvatar>
  );
}
