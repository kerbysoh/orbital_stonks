import React, {useState, useEffect} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'

export default function RiskLevel() {
  const db = firebase.firestore()
  const [value, setValue] = useState('');
  const [databasevalue, setDatabaseValue] = useState('')
  
  useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('RiskLevel')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setDatabaseValue(doc.get("Risk"))
                } 
            })
            
            return unsubscribe
        }
    }, [db])

  const useStyles = makeStyles((theme) => ({

  tableContainer: {
    marginTop: '2rem',
    borderRadius: 15,
    margin: 'auto',
    maxWidth: 650
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.getContrastText(theme.palette.secondary.dark)
  },
  tableBody: {
    margin: 'auto',
  },
}));
    const classes = useStyles()



    const handleChange = (event) => {
        setValue(event.target.value);        
        db.collection("RiskLevel").doc(`${fire.auth().currentUser.email}`).update({
             Risk : event.target.value
        })
        
    };

  return (
      <TableContainer component={Paper} className = {classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
              <TableHead>
                  <TableRow>
                      <TableCell className = {classes.tableHeaderCell} align="Center">
                        RISK LEVEL
                      </TableCell>
                  </TableRow>
              </TableHead>
              <TableBody className = {classes.tableBody}>
                <RadioGroup aria-label="risk" name="risklevel" value={databasevalue} onChange={handleChange}>
                    <FormControlLabel className = {classes.tableBody} value="Low" control={<Radio />} label="Low" />
                    <FormControlLabel className = {classes.tableBody} value="Medium" control={<Radio />} label="Medium" />
                    <FormControlLabel className = {classes.tableBody} value="High" control={<Radio />} label="High" />
                    {/* <FormControlLabel className = {classes.tableBody}value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
                </RadioGroup>
              </TableBody>
          </Table>
      </TableContainer>
  );
}

