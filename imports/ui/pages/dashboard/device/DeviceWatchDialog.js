import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

// import components
import DeviceWatchList from './DeviceWatchHistoryList';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import { RollsCollection } from '/imports/db/RollsCollection';
import { useQuery } from "@apollo/react-hooks";

// import queries
import { rollsByMACQuery } from '../../queries'

// utils
import getDateFromTimestamp from '../../../utils/getDateFromTimeStamp';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
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
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function DeviceWatchDialog({ isOpen, macAddr, onCloseDialog }) {
  const [rollHistory, setRollHistory] = useState([]);
  const  { loading, data, refetch } = useQuery(rollsByMACQuery, {
    variables: { device: macAddr },
  });

  refetch();

  const { isLoading, rollCount } = useTracker(() => {
    const noDataAvailable = { rollCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('rolls');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const rollCount = RollsCollection.find({device: macAddr}).count();

    return { rollCount };
  });
 
  const rollsByMAC = data && data.rollsByMAC || [];

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const newWatchList = [];
    rollsByMAC.map((item) => {
      const { createdAt } = item;
      const diff = getDateFromTimestamp(createdAt);
      newWatchList.push({...item, createdAt: new Date(Number(createdAt)).toDateString(), elapsedTime: diff})
    })

    setRollHistory(newWatchList);
  }, [rollsByMAC, isOpen]);

  const handleClose = () => {
    onCloseDialog(true);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{ '& .MuiPaper-root': { maxWidth: '100%' } }}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography variant="body2" sx={{ fontWeight: 100 }}> (MAC Address: {macAddr})</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {isLoading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
            <DeviceWatchList watchList={rollHistory} />
          }
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}