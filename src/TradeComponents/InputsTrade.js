import React,{useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import OpenDialogue from './OpenDialogue'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    container: {
    display: 'flex',
    flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 2000,
    },
  },
}));

export default function ValidationTextFields() {
  const classes = useStyles();
  const [ticker, setTicker] = useState("")
  const [amount, setAmount] = useState(0)
  const [startDate, setStartDate] = useState("2021-05-24");
  const [endDate, setEndDate] = useState("2021-05-24");


  const changeStart = (e) => {
    setStartDate(e.target.value)
  }

  const changeEnd = (e) => {
    setEndDate(e.target.value)
  }

  const changeTicker = (e) => {
    setTicker(e.target.value)
  }

  const changeAmount = (e) => {
    setAmount(e.target.value)
  }
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          // error
          onChange = {(e) => changeTicker(e)}
          id="filled-error"
          label="Input Ticker"
          placeholder="Ticker..."
          variant="filled"
        />
        <br/>
        <TextField
          //error
          onChange = {(e) => changeAmount(e)}
          id="filled-error-helper-text"
          label="Input Amount"
          placeholder="Amount..."
          type="number"
          //defaultValue="Hello World"
          //helperText="Incorrect entry."
          variant="filled"
        />
      </div>
      <div>
        <TextField
          onChange = {(e) => changeStart(e)}
          id="date"
          label="Start Date"
          type="date"
          value = {startDate}
          //value = {startDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <TextField
          onChange = {(e) => changeEnd(e)}
          id="date"
          label="End Date"
          type="date"
          value = {endDate}
          //value = {endDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <OpenDialogue amount = {amount} ticker = {ticker} startDate = {startDate} endDate={endDate}></OpenDialogue>

    </form>
    
  );
}


