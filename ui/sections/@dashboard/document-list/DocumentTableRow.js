import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, Checkbox } from '@mui/material';
// components
import Label from '../../../components/Label';
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';

// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

DocumentTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function DocumentTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { title, isPublic, createdAt } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left">{title}</TableCell>
      <TableCell align="left">
        <Label variant="ghost" color={isPublic ? 'success' : 'primary'}>
          {sentenceCase(isPublic ? 'Public' : 'Private')}
        </Label>
      </TableCell>
      <TableCell align="left">{fDate(new Date(createdAt))}</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
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
