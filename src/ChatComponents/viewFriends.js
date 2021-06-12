import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'
import {
    Typography,
    Grid,
    makeStyles,
    Button,
    Avatar
  } from "@material-ui/core";
  import ClearIcon from "@material-ui/icons/Clear";
  const useStyles = makeStyles(theme => ({
    page: {
      padding: theme.spacing(10)
    },
    root: {
      border: `1px solid ${theme.palette.secondary[400]}`,
      padding: theme.spacing(2),
      borderRadius: "2px",
      maxWidth: 200
    },
    header: {
      color: theme.palette.grey[400],
      height: "15px"
    },
    photoContainer: {
      marginBottom: theme.spacing(1)
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7)
    },
    verified: {
      height: 20
    },
    channelUserName: {
      fontWeight: theme.typography.fontWeightBold
    },
    chanelNameContainer: {
      marginBottom: theme.spacing(1)
    },
    followButton: {
      textTransform: "none",
      paddingRight: theme.spacing(6),
      paddingLeft: theme.spacing(6),
      fontWeight: theme.typography.fontWeightMedium
    }
  }));


const ViewFriends = () => {
    const classes = useStyles()
    const db = firebase.firestore()
    const [friends, setFriends] = useState({})
    
    useEffect (() => {
        if (db) {
            const unsubscribe = db
            db.collection('friends')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) { 
                setFriends(doc.data())
                }
            })
            
            
            return unsubscribe
        }
    }, [db])
    return (
        <>
        <button><Link to = '/Friends'>Add Friends</Link></button>
        
        {Object.values(friends).map((key, i) => {
            return (
                <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.root}
      >
            
            <Grid container justify="flex-end">
      <Grid item xs={1}>
        <ClearIcon className={classes.header}/>
      </Grid>
    </Grid>
    <div className={classes.photoContainer}>
      <Avatar
        className={classes.avatar}
      />
    </div>
    <Grid container justify="center" alignItems="center" spacing={5}>
      <Grid item xs={5.5}>
        <Typography variant="body2" className={classes.channelUserName}>
          {key.firstname}
        </Typography>
      </Grid>
    </Grid>
    <div className={classes.chanelNameContainer}>
      <Typography color="textSecondary" variant="caption">
        {key.email}
      </Typography>
    </div>
    </Grid>
            )
            
        })}
        </>
    )

}
export default ViewFriends