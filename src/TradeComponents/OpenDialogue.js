import React from 'react';
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAmount = () => {
        db.collection("Amount").doc(`${userEmail}`).update({
            Amount : props.placeholderamount
        })
        db.collection('Transaction').doc(`${userEmail}`).add({
          Ticker: "XYZ",
          Amount: 12345,
          StartDate: 211018,
          EndDate: 211119,
          ProfitAndLoss: 5,
        })
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Set Amount
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="Set Amount?">{"Set Amount?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm Trading Amount
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={() => {handleClose(); handleAddAmount();}} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
