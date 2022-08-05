import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, Stack } from '@mui/material';

// hooks
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';

// config
import { NAVBAR } from '../../config';

// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import { NavSectionVertical } from '../../components/nav-section';
//
import navConfig from './NavConfig';
import NavbarAccount from './NavbarAccount';
import CollapseButton from './CollapseButton';
// utils
import cssStyles from '../../utils/cssStyles';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter
    })
  }
}));

// ----------------------------------------------------------------------

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>

      <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      {!isDesktop && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};
