import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

import ConfirmDialog from '../../../components/ConfirmDialog';

// ----------------------------------------------------------------------

export default function TableMoreMenu({ _id, onDelete, editLink }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    setIsOpen(false);
    if (isAgree) onDelete(_id);
  };

  return (
    <>
      <ConfirmDialog
        onAgree={handleAgree}
        isOpen={dialogOpen}
        title="Meteor Starter Kit | Confirm"
        content="Are you sure to delete this item?"
      />
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={editLink} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

TableMoreMenu.propTypes = {
  _id: PropTypes.string,
  onDelete: PropTypes.func,
  editLink: PropTypes.string,
};
