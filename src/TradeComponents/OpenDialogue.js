import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "firebase/firestore";
import firebase from "firebase/app";
import fire from "../fire";
import Value from "./lib/getAccountValue"
import Stock from "./lib/getDownTrendingStock"
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function AlertDialog(props) {
  const db = firebase.firestore();
  const userEmail = fire.auth().currentUser.email;
  const API_KEY = "TQ6LE1RSC9LBHZTL";
  const [legit, setLegit] = useState(true);
  const [opensnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("Transaction Set!")

  const handleClickSnack = () => {
    if (
      props.amount <= 0 &
      props.startDate >= props.endDate
    ) {
      setMessage("Incorrect Amount and Date!");
      setOpenSnack(true);
      
    } else if (props.amount <= 0 ) {
      setMessage("Incorrect Amount!");
      setOpenSnack(true);
      
    } else if (props.startDate >= props.endDate) {
      setMessage("Incorrect Date!");
      setOpenSnack(true);
    } else {
      setOpenSnack(false);
    }
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  useEffect(() => {
     if (
       props.amount <= 0 ||
       props.startDate >= props.endDate
     ) {
       setLegit(false);
     } else {
       setLegit(true);
     }
  });

  const handleStockSearch = () => {
    let API_Call = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${props.ticker}&apikey=${API_KEY}`;

    fetch(API_Call)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.Symbol) {
          if(legit){
            handleClickOpen();
          }
        } else {
          setOpenSnack(true);
          setMessage("Unknown Stock!");
        }
      });
  };

  const transaction = {
    Ticker: props.ticker,
    Amount: props.amount,
    StartDate: props.startDate,
    EndDate: props.endDate,
    ProfitAndLoss: 0,
    RiskLevel: props.risk,
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (legit) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAmount = () => {
    db.collection("Amount").doc(`${userEmail}`).update({
      Amount: props.amount,
    });
  };

  const handleAddTransaction = () => {
    db.collection("Transaction")
      .doc(`${userEmail}`)
      .update({
        [props.ticker]: transaction,
      });
  };

  const handlePlaceOrder = () => {
    <>
    <Value value = {props.amount}></Value>
    <Stock stock = {props.ticker}></Stock>
    </>
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="black"
        className="postButton"
        onClick={() => {
          {handleStockSearch(); handleClickSnack();} 
        }}
      >
        Trade
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={opensnack}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
        onClose={() => setOpenSnack(false)}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="Set Transaction?">{"Set Transaction?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm Trade?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleAddAmount();
              handleAddTransaction();
              handlePlaceOrder();
            }}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
