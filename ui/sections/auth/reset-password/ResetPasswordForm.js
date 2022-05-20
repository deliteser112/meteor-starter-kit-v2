import { Accounts } from 'meteor/accounts-base';

import React, { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [isError, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      setError(false);

      await new Promise((resolve) => setTimeout(resolve, 500));

      sessionStorage.setItem('email-recovery', data.email);

      const { email } = data;

      Accounts.forgotPassword({ email }, (error) => {
        if (error) {
          const { reason } = error;
          setError(true);
          setErrorText(reason);
        } else {
          console.log(`Check ${email} for a reset link!`, 'success');
          navigate(PATH_AUTH.newPassword);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {isError && <Alert severity="error">{errorText}</Alert>}
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send Request
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
