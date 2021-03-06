import {React, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginTop: '1rem',
    borderRadius: 15,
    margin: 'auto',
    maxWidth: 950
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: "black",
    color: theme.palette.getContrastText(theme.palette.primary.light)
  }
}));

export default function BasicTable({stock, setStock}) {
  const classes = useStyles();
  const handleClose = () => {
    setDOpen(false);
  };
  const [dOpen, setDOpen] = useState(false)

  return (
    <>
    <TableContainer component={Paper} className = {classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className = {classes.tableHeaderCell}>Stocks</TableCell>
            <TableCell className = {classes.tableHeaderCell} align="Center">View Stock</TableCell>

 
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(stock).map((key, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {key}
                
              </TableCell>
              <TableCell align="left"><Button key={key}>
                <Link
                  to = "/StockGraphs"
                    className = 'stockGraphLink'
                    onClick = {() => setStock(key)}
                >
                  View stock data
                </Link>
              </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
       
     </>
  );
}
