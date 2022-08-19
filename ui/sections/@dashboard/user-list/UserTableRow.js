import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, Checkbox, Stack, Avatar, Typography } from '@mui/material';
// components
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';
import ConfirmDialog from '../../../components/ConfirmDialog';
import MyAvatar from '../../../components/MyAvatar';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { _id, name, emailAddress, emailVerified, oAuthProvider, avatarUrl } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    if (isAgree) onDeleteRow(_id);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <MyAvatar src={avatarUrl} displayName={`${name.first} ${name.last ? name.last : ''}`} />
          <Typography variant="subtitle2" noWrap>
            {`${name.first} ${name.last ? name.last : ''}`}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">{emailAddress}</TableCell>
      <TableCell align="center">
        <Iconify
          icon={oAuthProvider ? `bi:${oAuthProvider}` : 'fluent:password-16-regular'}
          sx={{
            width: 20,
            height: 20
          }}
          color={
            (oAuthProvider === 'github' && 'black.main') ||
            (oAuthProvider === 'facebook' && 'info.main') ||
            (oAuthProvider === 'google' && 'error.main')
          }
        />
      </TableCell>
      <TableCell align="center">
        <Iconify
          icon={emailVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!emailVerified && { color: 'warning.main' })
          }}
        />
      </TableCell>
      <TableCell align="right">
        <ConfirmDialog
          onAgree={handleAgree}
          isOpen={dialogOpen}
          title="Meteor Starter Kit | Confirm"
          content="Are you sure to delete this item?"
        />
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleDelete();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
