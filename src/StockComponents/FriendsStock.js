import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import Navbar from '../components/Navbar'
import './FriendsStock.css'
import FriendsBasicTable from './FriendsBasicTable'
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 275,
        margin: 'auto',
        marginTop: '1rem',
        backgroundColor: "#ded7c8",
        borderRadius: '7rem',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
    },
    pos: {
        textAlign: 'center',
    },
    });

const FriendsStock = (props) => {
    
    const classes = useStyles();

  const {handleLogout, profile, setProfile,stock, setStock } = props
  const db = firebase.firestore()
    useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('Stocks')
            .doc(profile)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setStock(doc.data())
                } 
            })
            
            return unsubscribe
        }
    }, [db])

    return (
      <div className="page-background">
        <Navbar handleLogout={handleLogout} />
        <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          WATCHLIST BY
        </Typography>
        <Typography variant="h5" component="h2" className={classes.pos}>
          {profile}
        </Typography>
      </CardContent>
    </Card>
        <div >
          <FriendsBasicTable
            stock={stock}
            setStock={setStock}
          />
        </div>
      </div>
    );
}


export default FriendsStock;