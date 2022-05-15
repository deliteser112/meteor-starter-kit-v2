import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    Accounts.verifyEmail(token, (error) => {
      if (error) {
        enqueueSnackbar(error.reason, { variant: 'error' });
        navigate(PATH_DASHBOARD.root);
      } else {
        enqueueSnackbar('Verified Successfully!', { variant: 'success' });
        navigate(PATH_DASHBOARD.root);
      }
    });
  }, []);
  return <LoadingScreen />;
}
