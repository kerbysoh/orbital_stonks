import React,{useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import OpenDialogue from './OpenDialogue'
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import RiskLevel from "./RiskLevel";

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
    button: {
    backgroundcolor: 'grey'
    },
  },
}));

export default function ValidationTextFields() {
  const classes = useStyles();
  const [ticker, setTicker] = useState("")
  const [amount, setAmount] = useState(0)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [realticker, setRealTicker] = useState(false)
  const API_KEY = 'TQ6LE1RSC9LBHZTL';
  const [risk, setRisk] = useState("")
  const db = firebase.firestore()
  
  useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('RiskLevel')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setRisk(doc.get("Risk"))
                } 
            })
            
            return unsubscribe
        }
    }, [db])

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

  const handleStockSearch = () => {
        let API_Call =  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
          
          fetch(API_Call)
            .then(
              function(response){
                return response.json();
                
              }
            )
            .then(
              function(data){
                if(data.Symbol) {
                  setRealTicker(true)
                } else {
                  setRealTicker(false)
                }
              }
            )         
    }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <RiskLevel></RiskLevel>
      
      <div>
          <TextField
          onChange = {(e) => changeTicker(e)}
          label="Input Ticker"
          placeholder="Ticker..."
          variant="filled"
        />
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
        <div>
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
      
      <TextField
          onChange = {(e) => changeEnd(e)}
          id="date"
          label="End Date"
          type="date"
          value = {endDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </div>
        <OpenDialogue risk = {risk} realticker = {realticker} amount = {amount} ticker = {ticker} startDate = {startDate} endDate={endDate}></OpenDialogue>

    </form>
    
  );
}


