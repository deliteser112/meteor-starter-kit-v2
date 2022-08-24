import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Cloudinary } from 'meteor/socialize:cloudinary';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Box, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSwitch, RHFEditor, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import {
  addDocument as addDocumentMutation,
  updateDocument as updateDocumentMutation
} from '../../../_mutations/Documents.gql';
import { documents as documentsQuery } from '../../../_queries/Documents.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

DocumentNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDocument: PropTypes.object
};

export default function DocumentNewEditForm({ isEdit, currentDocument }) {
  const [addDocument] = useMutation(addDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [coverImg, setCoverImg] = useState('');

  const NewDocumentSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Description is required'),
    cover: Yup.mixed().required('Cover is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentDocument?.title || '',
      body: currentDocument?.body || '',
      cover: (currentDocument?.cover && currentDocument?.cover.url) || null,
      isPublic: currentDocument?.isPublic || false
    }),
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentSchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
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
      const { body, isPublic, title } = values;
      let cover;
      if (coverImg !== '') {
        const imageInfo = await Cloudinary.uploadFile(coverImg);
        cover = {
          url: imageInfo.url,
          public_id: imageInfo.public_id
        };
      } else {
        cover = {
          url: currentDocument.cover.url,
          public_id: currentDocument.cover.public_id
        };
      }

      const mutation = isEdit ? updateDocument : addDocument;
      const documentToAddOrUpdate = {
        title,
        body,
        cover
      };

      if (isEdit) {
        documentToAddOrUpdate.isPublic = isPublic;
        documentToAddOrUpdate._id = currentDocument._id;
        if (coverImg !== '' && currentDocument.cover) {
          const { public_id } = currentDocument.cover;
          await Cloudinary.delete(public_id);
        }
      }

      mutation({
        variables: {
          ...documentToAddOrUpdate
        },
        refetchQueries: [{ query: documentsQuery }]
      }).then(() => {
        reset();
        enqueueSnackbar(!isEdit ? 'Created successfully!' : 'Updated successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
        navigate(PATH_DASHBOARD.document.root);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = async (e) => {
          setCoverImg(fileReader.result);
        };

        fileReader.readAsArrayBuffer(file);
      }
    },
    [setValue]
  );

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
              <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
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
