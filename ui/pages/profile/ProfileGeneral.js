import { Accounts } from 'meteor/accounts-base';
import { useMutation } from '@apollo/react-hooks';

import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, IconButton } from '@mui/material';

// hooks
import useAuth from '../../hooks/useAuth';

// utils
import { fData } from '../../utils/formatNumber';
import resizeBase64Img from '../../utils/resizeBase64Img';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';

import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';

// mutations & queries
import { updateUser as updateUserMutation } from '../../_mutations/Users.gql';
import { user as userQuery } from '../../_queries/Users.gql';

// ----------------------------------------------------------------------

export default function ProfileGeneral({ isEdit, currentUser }) {
  const { refetchProfileInfo } = useAuth();

  const [updateUser] = useMutation(updateUserMutation);

  const [userType, setUserType] = useState('password');
  const [oAuthIcon, setOAuthIcon] = useState('github');
  const [avatarUrl, setAvatarUrl] = useState('');

  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email(),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== '')
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
      const { oAuthProvider, avatarUrl } = currentUser;
      setUserType(oAuthProvider ? 'oauth' : 'password');
      setOAuthIcon(oAuthProvider);
      setAvatarUrl(avatarUrl);
      defaultValues;
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { firstName, lastName, email, newPassword, oldPassword } = values;
    updateUser({
      variables: {
        user: {
          email,
          profile: {
            name: {
              first: firstName,
              last: lastName
            }
          },
          avatarUrl
        }
      },
      refetchQueries: [{ query: userQuery }]
    }).then(async () => {
      if (newPassword) {
        Accounts.changePassword(oldPassword, newPassword, async (error) => {
          if (error) {
            enqueueSnackbar(error.reason, {
              variant: 'error',
              autoHideDuration: 2500,
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Iconify icon="eva:close-outline" />
                </IconButton>
              )
            });
          } else {
            reset();
            enqueueSnackbar('Update success', {
              variant: 'success',
              autoHideDuration: 2500,
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Iconify icon="eva:close-outline" />
                </IconButton>
              )
            });
            navigate(PATH_DASHBOARD.root);
          }
        });
      } else {
        reset();
        enqueueSnackbar('Update success', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
        navigate(PATH_DASHBOARD.root);
      }
      setTimeout(async () => {
        await refetchProfileInfo();
      }, 2000);
    });
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

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = async (e) => {
          const image = await resizeBase64Img(fileReader, 150);
          setAvatarUrl(image);
        };

        fileReader.readAsArrayBuffer(file);
      }
    },
    [setValue]
  );

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
                maxSize={1048576}
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
                    <br /> max size of {fData(1048576)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {userType === 'password' ? (
            <Card sx={{ p: 3 }}>
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
                <RHFTextField name="firstName" label="First Name" />
                <RHFTextField name="lastName" label="Last Name" />
                <RHFTextField name="email" label="Email Address" />
                <RHFTextField name="oldPassword" type="password" label="Old Password" />
                <RHFTextField name="newPassword" type="password" label="New Password" />
                <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          ) : (
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center">
                <Typography variant="body2">
                  You are logged in with
                  <Label color="success">{capitalCase(oAuthIcon)}</Label>
                  using the email address
                  <Label color="primary">{values.email}</Label>
                </Typography>
              </Stack>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Button
                  href={
                    {
                      facebook: 'https://www.facebook.com/settings',
                      google: 'https://myaccount.google.com/privacy#personalinfo',
                      github: 'https://github.com/settings/profile'
                    }[oAuthIcon]
                  }
                  variant="contained"
                  target="_blank"
                >
                  Edit Profile on {capitalCase(oAuthIcon)}
                </Button>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProfileGeneral.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};
