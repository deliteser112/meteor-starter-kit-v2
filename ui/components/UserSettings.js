import PropTypes from 'prop-types';
import React from 'react';
import { useSnackbar } from 'notistack';

// @mui
import {
  Switch,
  ListItem,
  List,
  ListItemAvatar,
  TextField,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

import SettingsIcon from '@mui/icons-material/Settings';

// graphql & collections
import { useMutation } from '@apollo/react-hooks';

// import mutations
import { updateUser as updateUserMutation } from '../_mutations/Users.gql';
import { userSettings as userSettingsQuery } from '../_queries/Users.gql';

// components
import EmptyContent from './EmptyContent';

// modules
import unfreezeApolloCacheValue from '../../modules/unfreezeApolloCacheValue';

// ----------------------------------------------------------------------
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));

export default function ProfileSettings({ userId, settings }) {
  const { enqueueSnackbar } = useSnackbar();

  // mutation define
  const [updateUser] = useMutation(updateUserMutation);

  const handleUpdateSetting = async (setting) => {
    const uId = null;
    const settingsUpdate = [...settings];
    const settingToUpdate = settingsUpdate.find(({ _id }) => _id === setting._id);

    settingToUpdate.value = setting.value;

    if (!uId) settingToUpdate.lastUpdatedByUser = new Date().toISOString();

    updateUser({
      variables: {
        user: {
          settings: unfreezeApolloCacheValue(settingsUpdate).map((setting) => {
            const settingToUpdate = setting;
            settingToUpdate.lastUpdatedByUser = new Date().toISOString();
            return settingToUpdate;
          })
        }
      }
    });
  };

  const renderSettingValue = (type, key, value, onChange) =>
    ({
      boolean: () => (
        <FormControlLabel
          control={
            <Android12Switch
              checked={value === 'true'}
              onChange={(e) => onChange({ key, value: `${e.target.checked}` })}
            />
          }
        />
      ),
      number: () => (
        <TextField
          id="outlined-name"
          label="Default Value"
          type="number"
          value={value}
          onChange={(event) => onChange({ key, value: parseInt(event.target.value, 10) })}
        />
      ),
      string: () => (
        <TextField
          id="outlined-name"
          label="Default Value"
          type="text"
          value={value}
          onChange={(event) => onChange({ key, value: event.target.value })}
        />
      )
    }[type]());

  return (
    <Card>
      <CardContent sx={{ padding: { xs: 0, md: 2 }, paddingBottom: { xs: 0, md: 3 } }}>
        {settings.length > 0 ? (
          <List>
            {settings.map(({ _id, key, label, type, value }, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <div>{renderSettingValue(type, key, value, (update) => handleUpdateSetting({ ...update, _id }))}</div>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <SettingsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={key} secondary={label} />
              </ListItem>
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
  );
}

ProfileSettings.propTypes = {
  userId: PropTypes.string,
  settings: PropTypes.array
};
