// meteor apollo graphql
import { useMutation } from "@apollo/react-hooks";

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
  ToggleButton,
  IconButton
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// graphql
import { documentMutation, documentUpdateMutation } from '../../mutations';

// utils
import stringAvatar from '../../../utils/stringAvatar';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

DocumentNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDocument: PropTypes.object,
  userList: PropTypes.array
};

export default function DocumentNewForm({ isEdit, loggedUser, currentDocument, userList }) {
  const [addDocumentMutation] = useMutation(documentMutation);
  const [updateDocumentUpdateMutation] = useMutation(documentUpdateMutation);
  const [defaultOwner, setDefalutOwner] = useState({});
  const [followers, setFollowers] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [isOwner, setOwner] = useState(false);
  const [isFollowed, setFollowed] = useState(false);

  const [selected, setSelected] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Document Name is required'),
    mac: Yup.string().required('Document ID is required')
  });

  useEffect(() => {
    if(currentDocument && isEdit && userList.length > 0) {
      const { followerIds, ownerId } = currentDocument;
      const tmpFollowers = [];
      followerIds.map(fId => {
        userList.map((item) => {
          if(fId === item._id) tmpFollowers.push(item);
        })
      })

      userList.map((item) => {
        if(ownerId === item._id) setDefalutOwner(item);
      })

      setFollowers([...tmpFollowers]);
    }
  }, [currentDocument, isEdit, userList]);
  
  useEffect(() => {
    if (loggedUser && !isEdit) {
      const { _id, emails, profile } = loggedUser;
      const currentUser = {
        _id,
        email: emails[0].address,
        profile
      }
      setDefalutOwner(currentUser)
    }
  }, [loggedUser, isEdit])
  
  useEffect(() => {
    if (loggedUser) {
      const { _id, emails, profile } = loggedUser;
      const currentUser = {
        _id,
        email: emails[0].address,
        profile
      }
      const { role } = profile;
      setAdmin(role === 'admin');
    }
  }, [loggedUser])

  useEffect(() => {
    if (loggedUser && currentDocument && isEdit) {
      const { _id, profile } = loggedUser;
      const { ownerId, followerIds } = currentDocument;
     
      const { role } = profile;
      setFollowed(followerIds.includes(_id));
      setOwner(isEdit && (ownerId === _id || role === 'admin'));
    } else {
      setOwner(true);
    }
  }, [loggedUser, currentDocument, isEdit])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentDocument?.name || '',
      mac: currentDocument?.mac || ''
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const { mac, name } = values;
        const ownerId = defaultOwner._id;
        const followerIds = [];
        followers.map((item) => {
          followerIds.push(item._id);
        });

        if(!isEdit) {
          addDocumentMutation({
            variables: {
              mac,
              name,
              ownerId,
              followerIds
            },
            refetchQueries: () => ['documents']
          })
          .then(({data}) => {
            const { addDocument } = data;
            if(addDocument) {
              enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
              navigate(PATH_DASHBOARD.documents);
            }
            else {
              enqueueSnackbar('The Document ID should be unique', { variant: 'warning' });
            }
          })
          .catch(e => console.error('Error trying to add document', e));
        } else {
          const { _id } = currentDocument;
          updateDocumentUpdateMutation({
            variables: {
              deviceId: _id,
              mac,
              name,
              ownerId,
              followerIds
            },
            refetchQueries: () => ['documents']
          })
          .then(({data}) => {
            enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
            navigate(PATH_DASHBOARD.documents);
          })
          .catch(e => console.error('Error trying to add document', e));
        }
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

  const handleFollowers = (users) => {
    setFollowers(users);
  }

  const handleSetFollower = () => {
    setSelected(!selected);
    const { _id, emails, profile } = loggedUser;
    let isAdded = false;
    const currentUser = {
      _id,
      email: emails[0].address,
      profile
    }

    if (!selected) {
      followers.map((item) => {
        if(item._id === _id) isAdded = true;
      });
      if (!isAdded) setFollowers([...followers, currentUser]);
    } else {
      let tmpFollowers = [];
      followers.map(item => {
        if(item._id !== _id) tmpFollowers.push(item)
      });
      setFollowers(tmpFollowers);
    }
  }

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <ToggleButton
                  value="check"
                  disabled={isOwner || isFollowed}
                  sx={{ borderRadius: '50%' }}
                  selected={selected}
                  onChange={handleSetFollower}
                >
                  {selected ? <FavoriteIcon color="danger" /> : <FavoriteBorderIcon />}
                </ToggleButton>
              </Box>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={!isOwner}
                    label="Document Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    disabled={!isOwner}
                    label="Document ID"
                    {...getFieldProps('mac')}
                    error={Boolean(touched.mac && errors.mac)}
                    helperText={touched.mac && errors.mac}
                  />
                </Stack>

                <Grid item xs={12} sm={6} md={9}>
                  {defaultOwner.email && 
                    <Autocomplete
                      disabled={!isOwner}
                      readOnly={!isAdmin}
                      sx={{ width: '100% !important' }}
                      id="checkboxes-tags-demo"
                      options={[...userList]}
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
                          label="Owner" 
                          placeholder="Choose owner" 
                        />
                      )}
                    />
                  }
                  
                </Grid>
                <Grid item xs={12} sm={6} md={9}>
                  <Autocomplete
                    disabled={!isOwner}
                    sx={{ width: '100% !important' }}
                    multiple
                    limitTags={3}
                    id="checkboxes-tags-demo"
                    value={[...followers]}
                    options={userList}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.email}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, users) => handleFollowers(users)}
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
                      <TextField {...params} label="Co-Authors" placeholder="Choose following users" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={9}>
                  <TextField
                    fullWidth
                    id="standard-multiline-flexible"
                    label="Document Detail"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isOwner && !selected}>
                    {!isEdit ? 'Create Document' : selected ? 'Submit Request' : 'Save Changes'}
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
