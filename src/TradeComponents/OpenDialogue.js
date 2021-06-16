import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

export default function AlertDialog(props) {
  const db = firebase.firestore()
  const userEmail = fire.auth().currentUser.email
  const transaction = {Ticker: props.ticker,
            Amount: props.amount,
            StartDate: props.startDate,
            EndDate: props.endDate,
            ProfitAndLoss: 0};
            
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAmount = () => {
        db.collection("Amount").doc(`${userEmail}`).update({
            Amount : props.amount
        })
  };

  const handleAddTransaction = () => {
         db.collection('Transaction').doc(`${userEmail}`).update({
            [props.ticker] : transaction
        })
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Set Transaction
      </Button>
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
          <Button onClick={() => {handleClose(); handleAddAmount(); handleAddTransaction();}} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
