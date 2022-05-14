import { useQuery, useMutation } from "@apollo/react-hooks";

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { userSettings as userSettingsQuery } from "../_queries/Users.gql";
import { updateUser as updateUserMutation } from "../_mutations/Users.gql";
import unfreezeApolloCacheValue from '../../modules/unfreezeApolloCacheValue';

// components
import UserSettings from '../pages/profile/ProfileSettings';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function GDPRConsentModal() {
  const [open, setOpen] = useState(true);

  const [updateUser] = useMutation(updateUserMutation);
  const { loading, data, refetch } = useQuery(userSettingsQuery);

  const userSettings = data && data.user && data.user.settings || [];

  useEffect(() => {
    if (userSettings) {
      let gdprComplete = true;
      const gdprSettings = userSettings.filter(
        (setting) => setting.isGDPR === true
      );
      gdprSettings.forEach(({ lastUpdatedByUser }) => {
        if (!lastUpdatedByUser) gdprComplete = false;
      });
      setOpen(!gdprComplete);
    }
  }, [userSettings]);

  const handleSaveSettings = () => {
    if (userSettings) {
      updateUser({
        variables: {
          user: {
            settings: unfreezeApolloCacheValue(userSettings).map(
              (setting) => {
                const settingToUpdate = setting;
                settingToUpdate.lastUpdatedByUser = new Date().toISOString();
                return settingToUpdate;
              },
            ),
          },
        },
        refetchQueries: [{ query: userSettingsQuery }],
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <BootstrapDialog
        // TransitionComponent={Transition}
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          GDPR Consent
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            {"In cooperation with the European Union's (EU) "}
            <a
              href="https://www.eugdpr.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              General Data Protection Regulation
            </a>
            {
              " (GDPR), we need to obtain your consent for how we make use of your data. Please review each of the settings below to customize your experience."
            }
          </Typography>
          <UserSettings settings={userSettings} userId={Meteor.userId()} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveSettings}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
