import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button} from '../components/Button'
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});



export default function BasicTable({stock, removeItem}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stocks</TableCell>
            <TableCell align="Center">View Stock</TableCell>
            <TableCell align="Center">Remove Button</TableCell>

 
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
                  to={{
                    pathname: "/StockGraphs",
                    state: {
                      name: key,
                    },
                  }}
                >
                  View stock data
                </Link>
              </Button></TableCell>
              <TableCell align="left"><Button onClick={() => removeItem(key)}>Remove</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
