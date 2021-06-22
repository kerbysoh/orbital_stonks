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

export default function AlertDialog(props) {
  const db = firebase.firestore();
  const userEmail = fire.auth().currentUser.email;
  const API_KEY = "TQ6LE1RSC9LBHZTL";
  const [legit, setLegit] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (
      props.amount <= 0 ||
      props.startDate > props.endDate ||
      props.risk === ""
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
          setLegit(true);
          handleClickOpen();
        } else {
          setLegit(false);
          setErrMsg("Input Error");
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

  return (
    <div>
      <Button
        variant="outlined"
        color="black"
        onClick={() => {
          handleStockSearch();
        }}
      >
        Set Transaction
      </Button>
      <span className="errMsg">{errMsg}</span>
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
