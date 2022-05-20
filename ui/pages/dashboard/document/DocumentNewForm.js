import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSwitch, RHFEditor, RHFTextField } from '../../../components/hook-form';

// mutations
import {
  addDocument as addDocumentMutation,
  updateDocument as updateDocumentMutation,
} from '../../../_mutations/Documents.gql';
import { documents as documentsQuery } from '../../../_queries/Documents.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

DocumentNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDocument: PropTypes.object,
};

export default function DocumentNewEditForm({ isEdit, currentDocument }) {
  const [addDocument] = useMutation(addDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewDocumentSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentDocument?.title || '',
      body: currentDocument?.body || '',
      isPublic: currentDocument?.isPublic || false,
    }),
    [currentDocument],
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentDocument) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentDocument]);

  const onSubmit = async (values) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { body, isPublic, title } = values;
      const mutation = isEdit ? updateDocument : addDocument;
      const documentToAddOrUpdate = {
        title,
        body,
      };

      if (isEdit) {
        documentToAddOrUpdate.isPublic = isPublic;
        documentToAddOrUpdate._id = currentDocument._id;
      }

      mutation({
        variables: {
          ...documentToAddOrUpdate,
        },
        refetchQueries: [{ query: documentsQuery }],
      });
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.documents);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFSwitch name="isPublic" label="Public Document" />
              <RHFTextField name="title" label="Document Title" />
              <div>
                <LabelStyle>Document Content</LabelStyle>
                <RHFEditor simple name="body" />
              </div>
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
