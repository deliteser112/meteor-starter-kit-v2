import React, { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import {
  Box,
  FormControlLabel,
  Switch,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
} from '@mui/material';

// @mui
import { LoadingButton } from '@mui/lab';

import { FormProvider, RHFTextField } from '../../../components/hook-form';

// import queries
import userSettingsQuery from '../../../_queries/UserSettings.gql';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '100%',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

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
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function SettingDialog({
  addUserSetting,
  updateUserSetting,
  isOpen,
  isEdit,
  currentSetting,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const [settingType, setSettingType] = useState('boolean');
  const [defaultValue, setDefaultValue] = useState('true');
  const [isGDPR, setIsGDPR] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const NewSettingSchema = Yup.object().shape({
    key: Yup.string().required('Key Name is required'),
    label: Yup.string().required('Label is required'),
  });

  const defaultValues = useMemo(
    () => ({
      key: currentSetting?.key || '',
      label: currentSetting?.label || '',
    }),
    [currentSetting],
  );

  const methods = useForm({
    resolver: yupResolver(NewSettingSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentSetting) {
      const { isGDPR, label, key } = currentSetting;
      console.log(currentSetting);
      setValue('label', label);
      setValue('key', key);
      setIsGDPR(isGDPR);
      defaultValues;
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSetting]);

  const onSubmit = async (values) => {
    const { label, key } = values;
    const mutation = isEdit ? updateUserSetting : addUserSetting;
    const settingToAddOrUpdate = {
      isGDPR,
      key,
      label: label.trim(),
      type: settingType,
      value: defaultValue.toString(),
    };

    if (isEdit) {
      settingToAddOrUpdate._id = currentSetting._id;
      const confirmUpdate = confirm(
        "Are you sure? This will overwrite this setting for all users immediately. If you're changing the Key Name or Type, double-check that your UI can support this to avoid rendering errors.",
      );
      if (!confirmUpdate) return;
    }

    mutation({
      variables: {
        setting: settingToAddOrUpdate,
      },
      refetchQueries: [{ query: userSettingsQuery }]
    });
    reset();
    onClose(false);
    enqueueSnackbar(isEdit ? 'Update success' : 'Add success', {
      variant: 'success',
    });
  };

  const handleClose = () => {
    onClose(false);
  };

  const handleChangeType = (event) => {
    const type = event.target.value;
    switch (type) {
      case 'boolean':
        setDefaultValue('true');
        break;
      case 'number':
        setDefaultValue(5);
        break;
      case 'string':
        setDefaultValue('');
        break;
      default:
        break;
    }
    setSettingType(type);
  };

  const handleChangeDefaultValue = (event) => {
    setDefaultValue(event.target.value);
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {isEdit ? 'Edit User Setting' : 'Add a User Setting'}
        </BootstrapDialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField name="key" label="Key Name" />
              <FormControlLabel
                control={
                  <Android12Switch checked={isGDPR} onChange={(e) => setIsGDPR(e.target.checked)} />
                }
                label="Is this a GDPR setting?"
              />
            </Box>
            <Box m={2} />
            <RHFTextField
              name="label"
              label="Label"
              helperText="Some important text"
              sx={{ width: '100%' }}
            />
            <Box m={2} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={settingType}
                  label="Type"
                  onChange={handleChangeType}
                >
                  <MenuItem value="boolean">Boolean (true/false)</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="string">String</MenuItem>
                </Select>
              </FormControl>
              {settingType === 'boolean' ? (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Default Value</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={defaultValue}
                    label="Default Value"
                    onChange={handleChangeDefaultValue}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  id="outlined-name"
                  label="Default Value"
                  type={settingType === 'number' ? 'number' : 'text'}
                  value={defaultValue}
                  onChange={handleChangeDefaultValue}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Settings' : 'Save Changes'}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </BootstrapDialog>
    </div>
  );
}

SettingDialog.propTypes = {
  addUserSetting: PropTypes.func,
  updateUserSetting: PropTypes.func,
  isOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  currentSetting: PropTypes.object,
  onClose: PropTypes.func,
};
