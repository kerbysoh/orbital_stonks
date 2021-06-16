import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});



export default function BasicTable() {
  const classes = useStyles();
  const [rows, setRows] = useState([])
  const db = firebase.firestore()

  useEffect (() => {
        if (db) {
            const unsubscribe = db
          
            db.collection('Transaction')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) { 
                setRows(doc.data())
                }
            })
            return unsubscribe
        }
    }, [db])

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Profit And Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {Object.values(rows).map((row) => {
            return (<TableRow key={row.Ticker}>
              <TableCell component="th" scope="row">
                {row.Ticker}
              </TableCell>
              <TableCell align="right">{row.Amount}</TableCell>
              <TableCell align="right">{row.StartDate}</TableCell>
              <TableCell align="right">{row.EndDate}</TableCell>
              <TableCell align="right">{row.ProfitAndLoss}</TableCell>
            </TableRow>
          )})}
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}
