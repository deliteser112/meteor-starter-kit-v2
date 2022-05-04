// meteor apollo graphql
import { useMutation } from "@apollo/react-hooks";

import * as Yup from "yup";
import PropTypes from "prop-types";
import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField
} from "@mui/material";

// graphql
import { actionMutation, actionUpdateMutation } from "../../mutations";

// ----------------------------------------------------------------------

ActionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAction: PropTypes.object,
};

export default function ActionNewForm({ isEdit, currentAction }) {
  const [addActionMutation] = useMutation(actionMutation);
  const [updateActionMutation] = useMutation(actionUpdateMutation);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    action: Yup.string().required("Action is required"),
    equation: Yup.string().required("Equation is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentAction?.name || "",
      action: currentAction?.action || "",
      equation: currentAction?.equation || "",
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const { action, equation, name } = values;
        if (!isEdit) {
          addActionMutation({
            variables: {
              name,
              action,
              equation,
            },
            refetchQueries: () => ["actions"],
          })
            .then(({ data }) => {
              const { addAction } = data;
              if (addAction) {
                enqueueSnackbar(!isEdit ? "Create success" : "Update success", {
                  variant: "success",
                });
                navigate("/dashboard/action");
              } else {
                enqueueSnackbar("The Action should be unique", {
                  variant: "warning",
                });
              }
            })
            .catch((e) => console.error("Error trying to add action", e));
        } else {
          const { _id } = currentAction;
          updateActionMutation({
            variables: {
              actionId: _id,
              name,
              action,
              equation,
            },
            refetchQueries: () => ['actions']
          })
          .then(({data}) => {
            enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
            navigate('/dashboard/action');
          })
          .catch(e => console.error('Error trying to add action', e));
        }
        

        // refetch();

        resetForm();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Action Name"
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Action"
                    {...getFieldProps("action")}
                    error={Boolean(touched.action && errors.action)}
                    helperText={touched.action && errors.action}
                  />
                </Stack>

                <Grid item xs={12} sm={6} md={9}>
                  <TextField
                    fullWidth
                    label="Equation"
                    {...getFieldProps("equation")}
                    error={Boolean(touched.equation && errors.equation)}
                    helperText={touched.equation && errors.equation}
                  />
                </Grid>

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {!isEdit ? "Create Action" : "Save Changes"}
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
