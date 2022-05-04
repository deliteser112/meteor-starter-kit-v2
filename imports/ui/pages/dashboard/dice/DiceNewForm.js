// meteor apollo graphql
import { useMutation } from "@apollo/react-hooks";

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Autocomplete,
  Checkbox,
  TextField,
  Avatar,
  CardHeader,
  CardContent,
  Typography
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// components
import UploadAvatar from '../../../components/UploadAvatar';

// graphql
import { diceMutation, diceUpdateMutation } from '../../mutations';

// utils
import stringAvatar from '../../../utils/stringAvatar';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

DiceNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDice: PropTypes.object,
  userList: PropTypes.array,
  actionList: PropTypes.array
};

export default function DiceNewForm({ isEdit, loggedUser, currentDice, userList, actionList }) {
  const [addDiceMutation] = useMutation(diceMutation);
  const [updateDiceMutation] = useMutation(diceUpdateMutation);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [defaultOwner, setDefalutOwner] = useState({email: ''});
  const [actions, setActions] = useState([]);
  const [isAdmin, setAdmin] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    did: Yup.string().required('did is required'),
    name: Yup.string().required('Name is required')
  });

  useEffect(() => {
    if (isEdit && currentDice) {
      const { actionIds, coverImg } = currentDice;
      setAvatarUrl(coverImg);
      const tmpActions = [];
      actionIds.map(actionId => {
        actionList.map(item => {
          if (actionId === item._id) tmpActions.push(item);
        })
      })
      setActions(tmpActions);
    }
  }, [isEdit, currentDice]);

  useEffect(() => {
    if(actionList.length > 0 && !isEdit) {
      setActions([actionList[0]])
    }
  }, [isEdit, actionList]);
  
  useEffect(() => {
    if (loggedUser) {
      const { _id, emails, profile } = loggedUser;
      const currentUser = {
        _id,
        email: emails[0].address,
        profile
      }
      setDefalutOwner(currentUser)
      const { role } = profile;
      setAdmin(role === 'admin');
    }
  }, [loggedUser])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      did: currentDice?.did || '',
      name: currentDice?.name || ''
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const { did, name } = values;
        const userId = defaultOwner._id;
        const actionIds = [];

        actions.map((item) => {
          actionIds.push(item._id);
        });
        const mockNumber = (Math.random()*7 + 1).toFixed(0);
        const coverImg = `/static/mock-images/covers/cover_${mockNumber}.jpg`;

        if (!isEdit) {
          addDiceMutation({
            variables: {
              did,
              name,
              userId,
              actionIds,
              coverImg
            },
            refetchQueries: () => ['dices']
          })
          .then(({data}) => {
            const { addDice } = data;
            if(addDice) {
              enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
              navigate('/dashboard/dice');
            }
            else {
              enqueueSnackbar('The Dice should be unique', { variant: 'warning' });
            }
          })
          .catch(e => console.error('Error trying to add dice', e));
        } else {
          const { _id } = currentDice;
          updateDiceMutation({
            variables: {
              diceId: _id,
              did,
              name,
              userId,
              actionIds,
              coverImg
            },
            refetchQueries: () => ['dices']
          })
          .then(({data}) => {
            enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
            navigate('/dashboard/dice');
          })
          .catch(e => console.error('Error trying to add dice', e));
        }
    
        // refetch();

        resetForm();
        setSubmitting(false);
        
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const handleOwner = (user) => {
    setDefalutOwner(user)
  }

  const handleDropAvatar = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarUrl({
        ...file,
        preview: URL.createObjectURL(file)
      });
    }
  }, []);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title="Upload Dice Photo" />
              <CardContent>
                <UploadAvatar
                  accept="image/*"
                  file={avatarUrl}
                  onDrop={handleDropAvatar}
                  caption={
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
                      <br /> max size of 3.5MB
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="did"
                    {...getFieldProps('did')}
                    error={Boolean(touched.did && errors.did)}
                    helperText={touched.did && errors.did}
                  />
                  <TextField
                    fullWidth
                    label="name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Grid item xs={12} sm={6} md={9}>
                  {defaultOwner.email && 
                    <Autocomplete
                      readOnly={!isAdmin}
                      sx={{ width: '100% !important' }}
                      id="checkboxes-tags-demo"
                      options={userList}
                      value={defaultOwner}
                      getOptionLabel={(option) => option.email}
                      onChange={(event, user) => handleOwner(user)}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          <Avatar {...stringAvatar(`${option.profile.firstName} ${option.profile.lastName}`)} style={{ marginRight: 8 }} />
                          {option.profile.firstName} {option.profile.lastName}
                        </li>
                      )}
                      style={{ width: 500 }}
                      renderInput={(params) => (
                        <TextField
                          {...params} 
                          label="User" 
                          placeholder="Choose user" 
                        />
                      )}
                    />
                  }
                </Grid>
                <Grid item xs={12} sm={6} md={9}>
                  <Autocomplete
                    multiple
                    limitTags={4}
                    id="multiple-limit-tags"
                    options={actionList}
                    value={actions}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, actions) => setActions(actions)}
                    renderInput={(params) => (
                      <TextField {...params} label="Actions" placeholder="Choose actions" />
                    )}
                    sx={{ width: '100% !important' }}
                  />
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Dice' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
