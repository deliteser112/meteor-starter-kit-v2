import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';
// hooks
// import useLocales from '../../../hooks/useLocales';
// guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
// config
import { ICON } from '../../../config';
//
import Iconify from '../../Iconify';
import { ListItemStyle } from './style';
import { isExternalLink } from '..';

// ----------------------------------------------------------------------

// HANDLE SHOW ITEM BY ROLE
const ListItem = forwardRef((props, ref) => (
  <RoleBasedGuard roles={props.roles}>
    <ListItemStyle {...props} ref={ref}>
      {props.children}
    </ListItemStyle>
  </RoleBasedGuard>
));

ListItem.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export const NavItemRoot = forwardRef(({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
  // const { translate } = useLocales();

  const { title, path, icon, children, disabled, roles } = item;

  if (children) {
    return (
      <ListItem
        ref={ref}
        open={open}
        activeRoot={active}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={'translate(title)'} children={children} />
      </ListItem>
    );
  }

  return isExternalLink(path) ? (
    <ListItem component={Link} href={path} target="_blank" rel="noopener" disabled={disabled} roles={roles}>
      <NavItemContent icon={icon} title={'translate(title)'} children={children} />
    </ListItem>
  ) : (
    <ListItem component={RouterLink} to={path} activeRoot={active} disabled={disabled} roles={roles}>
      <NavItemContent icon={icon} title={'translate(title)'} children={children} />
    </ListItem>
  );
});

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

// ----------------------------------------------------------------------

export const NavItemSub = forwardRef(({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
  // const { translate } = useLocales();

  const { title, path, icon, children, disabled, roles } = item;

  if (children) {
    return (
      <ListItem
        ref={ref}
        subItem
        disableRipple
        open={open}
        activeSub={active}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={'translate(title)'} children={children} subItem />
      </ListItem>
    );
  }

  return isExternalLink(path) ? (
    <ListItem
      subItem
      href={path}
      disableRipple
      rel="noopener"
      target="_blank"
      component={Link}
      disabled={disabled}
      roles={roles}
    >
      <NavItemContent icon={icon} title={'translate(title)'} children={children} subItem />
    </ListItem>
  ) : (
    <ListItem
      disableRipple
      component={RouterLink}
      to={path}
      activeSub={active}
      subItem
      disabled={disabled}
      roles={roles}
    >
      <NavItemContent icon={icon} title={'translate(title)'} children={children} subItem />
    </ListItem>
  );
});

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

// ----------------------------------------------------------------------

NavItemContent.propTypes = {
  children: PropTypes.array,
  icon: PropTypes.any,
  subItem: PropTypes.bool,
  title: PropTypes.string,
};

function NavItemContent({ icon, title, children, subItem }) {
  // const { translate } = useLocales();

  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            '& svg': { width: '100%', height: '100%' },
          }}
        >
          {icon}
        </Box>
      )}

      {'translate(title)'}

      {children && (
        <Iconify
          icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'}
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        />
      )}
    </>
  );
}
