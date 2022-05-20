import { useMutation } from '@apollo/react-hooks';

import PropTypes from 'prop-types';
import { capitalCase, sentenceCase } from 'change-case';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Autocomplete,
  Checkbox,
  TextField
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';

import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// graphql
import { updateUser as updateUserMutation } from '../../../_mutations/Users.gql';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const [updateUser] = useMutation(updateUserMutation);
  const [defaultRoles, setDefaultRoles] = useState([]);
  const [userType, setUserType] = useState('password');
  const [oAuthIcon, setOAuthIcon] = useState('github');
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    // lastName: Yup.string().required("Last name is required"),
    email: Yup.string().required('Email is required').email(),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    // avatarUrl: Yup.mixed().test(
    //   "required",
    //   "Avatar is required",
    //   (value) => value !== ""
    // ),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.name?.first || '',
      lastName: currentUser?.name?.last || '',
      email: currentUser?.emailAddress || '',
      emailVerified: currentUser?.emailVerified || '',
      avatarUrl: currentUser?.avatarUrl || '',
      address: currentUser?.address || '',
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      roles: currentUser?.roles || [],
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      const { roles, oAuthProvider } = currentUser;
      setUserType(oAuthProvider ? 'oauth' : 'password');
      setOAuthIcon(oAuthProvider);
      const tmpRoles = [];
      roles.map((item) => {
        if (item.inRole) tmpRoles.push(item);
      });
      setDefaultRoles([...tmpRoles]);
      defaultValues;
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const onSubmit = async (values) => {
    const { firstName, lastName, email, newPassword } = values;
    const existingUser = currentUser;
    const isPasswordUser = existingUser && !existingUser.oAuthProvider;
    const password = isPasswordUser ? newPassword : null;

    const roles = [];
    defaultRoles.map((item) => {
      roles.push(item.name);
    });

    let userUpdate;

    if (isPasswordUser) {
      userUpdate = {
        email,
        password,
        profile: {
          name: {
            first: firstName,
            last: lastName
          }
        },
        roles
      };
    }

    if (!isPasswordUser) {
      userUpdate = {
        roles
      };
    }

    if (existingUser) userUpdate._id = existingUser._id;
    updateUser({ variables: { user: userUpdate } });
    reset();
    enqueueSnackbar('Update success!', {
      variant: 'success'
    });
    navigate(PATH_DASHBOARD.users);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );
      }
    },
    [setValue]
  );

  const handleChangeRoles = (roles) => {
    setDefaultRoles(roles);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <>
                {userType === 'password' ? (
                  <Label
                    color={values.emailVerified ? 'success' : 'error'}
                    sx={{
                      textTransform: 'uppercase',
                      position: 'absolute',
                      top: 24,
                      right: 24
                    }}
                  >
                    {values.emailVerified ? 'Verified' : 'Unverfied'}
                  </Label>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ position: 'absolute', top: 24, right: 24 }}
                  >
                    <Label color="success">Authorized by</Label>
                    <Iconify
                      icon={oAuthIcon ? `bi:${oAuthIcon}` : 'fluent:password-16-regular'}
                      sx={{
                        width: 20,
                        height: 20
                      }}
                      color={
                        (oAuthIcon === 'github' && 'black.main') ||
                        (oAuthIcon === 'facebook' && 'info.main') ||
                        (oAuthIcon === 'google' && 'error.main')
                      }
                    />
                  </Stack>
                )}
              </>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <FormControlLabel
              labelPlacement="start"
              control={
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value !== 'active'}
                      onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                    />
                  )}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Banned
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Apply disable account
                  </Typography>
                </>
              }
              sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            {userType === 'oauth' && (
              <Stack direction="row" alignItems="center">
                <Typography variant="body2">
                  {values.firstName} is logged in with
                  <Label color="success">{capitalCase(oAuthIcon)}</Label>
                  using the email address
                  <Label color="primary">{values.email}</Label>
                </Typography>
              </Stack>
            )}
            <Box m={2} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)'
                }
              }}
            >
              <RHFTextField name="firstName" label="First Name" disabled={userType === 'oauth'} />
              <RHFTextField name="lastName" label="Last Name" disabled={userType === 'oauth'} />
              <RHFTextField name="email" label="Email Address" disabled={userType === 'oauth'} />
            </Box>
            <Box m={2} />
            {/* {currentUser && Roles.userIsInRole(currentUser._id, "admin") && ( */}
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={values.roles}
              disableCloseOnSelect
              value={defaultRoles}
              onChange={(event, role) => handleChangeRoles(role)}
              getOptionLabel={(option) => sentenceCase(option.name)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {sentenceCase(option.name)}
                </li>
              )}
              style={{ width: 500 }}
              renderInput={(params) => <TextField {...params} label="Roles" placeholder="Set roles" />}
            />
            {/* )} */}
            <Box m={2} />
            {userType === 'password' && (
              <Stack direction="column" spacing={2}>
                <RHFTextField name="oldPassword" type="password" label="Old Password" />
                <RHFTextField name="newPassword" type="password" label="New Password" />
                <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />
              </Stack>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
