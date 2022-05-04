import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import {
  Typography,
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@mui/material";

import { useTracker } from "meteor/react-meteor-data";

// graphql & collections
import { useQuery } from "@apollo/react-hooks";

// import queries
import { actionsQuery, dicesQuery } from "../queries";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function getCalcuation(actions) {
  let digit = 0;
  let sum = 0;
  let eqs = '';
  actions.map((list) => {
    if (list[0] === 'd'){
      sum -= digit;
      [...Array(Math.abs(digit))].map((_, index) => {
        let rad = parseInt(Math.random()*list.split('d')[1] + 1);
        if(digit < 0) {
          rad *= -1;
          if (eqs !== '') eqs += '-';
        } else if(eqs !== '') eqs += '+';
        sum += rad;
        if(Math.abs(digit) > 1 && index === 0) eqs += '(';
        eqs += Math.abs(rad);
      });
      if(Math.abs(digit) > 1) eqs += ')';
      digit = 0;
    } else {
      if(digit !== 0) {
        if(eqs !== '') { 
          if(digit < 0) eqs += '-';
          else eqs += '+';
        }
        eqs += Math.abs(digit);
      }
      sum += parseInt(list);
      digit = parseInt(list);
    }
  });
  if(digit !== 0) {
    if(eqs !== '') {
      if(digit < 0) eqs += '-';
      else eqs += '+';
    }
    eqs += Math.abs(digit);
  }
  return {eqs, sum}
}

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
            position: "absolute",
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

export default function DeviceWatchDetailDialog({
  isOpen,
  data,
  onCloseDialog,
}) {

  useTracker(() => {
    Meteor.subscribe('rolls');
    Meteor.subscribe('dices');
    Meteor.subscribe('actions');
  });
  const dicesData = useQuery(dicesQuery).data;
  const actionsData = useQuery(actionsQuery).data;

  const [open, setOpen] = useState(false);

  const [macAddr, setMacAddr] = useState("");
  const [diceIds, setDiceIds] = useState([]);

  const [resList, setResList] = useState([]);

  useEffect(() => {
    if (dicesData && actionsData && diceIds.length > 0) {
      const { actions } = actionsData;
      const { dices } = dicesData;
      const resultList = [];
      const newDices = [];
      diceIds.map((did) => {
        dices.map((item) => {
          if (did === item.did) newDices.push(item);
        });
      });
      newDices.map((item) => {
        const { actionIds, coverImg, name } = item;
        const actionNames = [];
        actionIds.map((aId) => {
          actions.map((item) => {
            const { _id, name } = item;
            if(aId === _id) actionNames.push(name);
          });
        });
        let equation = "";
        actionNames.map(action => {
          equation += action;
        });

        const {eqs, sum} = getCalcuation(actionNames);

        resultList.push({
          coverImg,
          name,
          result: sum,
          calculation: eqs,
          equation
        })
      });
      setResList(resultList);
    }
  }, [dicesData, actionsData, diceIds]);

  useEffect(() => {
    if (data.diceIds) {
      const { diceIds, macAddr } = data;
      setMacAddr(macAddr);
      const dIds = diceIds.split(",");
      setDiceIds(dIds);
    }
  }, [data]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onCloseDialog(true);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="body2" sx={{ fontWeight: 100 }}>
            {" "}
            (MAC Address: {macAddr})
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ minWidth: 400 }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {resList.map((item, index) => 
            <Box key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={item.coverImg} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                      >
                        {item.result}
                      </Typography>
                      {` = ${item.calculation} — [${item.equation}]`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Box>
            )}
          </List>
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
