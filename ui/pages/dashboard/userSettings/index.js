import React, { useState } from 'react';
// @mui
import {
  Container,
  ListItem,
  List,
  ListItemAvatar,
  IconButton,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  Stack,
  Button,
  Box,
  Divider
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

// graphql & collections
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries
import userSettingsQuery from '../../../_queries/UserSettings.gql';

// import mutations
import {
  addUserSetting as addUserSettingMutation,
  updateUserSetting as updateUserSettingMutation,
  removeUserSetting as removeUserSettingMutation
} from '../../../_mutations/UserSettings.gql';

// components
import Page from '../../../components/Page';
import EmptyContent from '../../../components/EmptyContent';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import { SkeletonUserSettings } from '../../../components/skeleton';

import SettingDialog from './SettingDialog';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function UserSettings() {
  // mutation define
  const [addUserSetting] = useMutation(addUserSettingMutation);
  const [updateUserSetting] = useMutation(updateUserSettingMutation);
  const [removeUserSetting] = useMutation(removeUserSettingMutation);

  const [showAddSetting, setShowAddSetting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSetting, setCurrentSetting] = useState({});

  // queries
  const { loading, data } = useQuery(userSettingsQuery);
  const userSettings = (data && data.userSettings) || [];

  const handleAddSetting = () => {
    setIsEdit(false);
    setCurrentSetting(null);
    setShowAddSetting(true);
  };

  const handleEditSetting = (setting) => {
    setIsEdit(true);
    setCurrentSetting(setting);
    setShowAddSetting(true);
  };

  const handleDeleteSetting = (settingId) => {
    if (
      confirm("Are you sure? Before deleting this setting make sure that it's no longer in use in your application!")
    ) {
      removeUserSetting({
        variables: {
          _id: settingId
        },
        refetchQueries: [{ query: userSettingsQuery }]
      });
    }
  };

  return (
    <Page title="User">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="User Settings"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'User Settings' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddSetting}>
              Add Setting
            </Button>
          }
        />
        <SettingDialog
          addUserSetting={addUserSetting}
          updateUserSetting={updateUserSetting}
          isOpen={showAddSetting}
          isEdit={isEdit}
          currentSetting={currentSetting}
          onClose={() => setShowAddSetting(false)}
        />
        <Card>
          <CardContent sx={{ padding: { xs: 0, md: 2 }, paddingBottom: { xs: 0, md: 3 } }}>
            {loading ? (
              <SkeletonUserSettings />
            ) : userSettings.length > 0 ? (
              <List>
                {userSettings.map((item, index) => (
                  <Box key={index}>
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEditSetting(item)}
                          >
                            <Iconify icon="eva:edit-2-outline" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDeleteSetting(item._id)}
                          >
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <SettingsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.key} secondary={item.label} />
                    </ListItem>
                    <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
                  </Box>
                ))}
              </List>
            ) : (
              <EmptyContent
                title="No Settings"
                sx={{
                  '& span.MuiBox-root': { height: 160 }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
