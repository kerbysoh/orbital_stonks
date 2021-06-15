import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

const MyProfileFollow = () =>  {
const db = firebase.firestore()
const [user, setUser] = useState({})

useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('users')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                   setUser(doc.data())
                } 
            })

            
            
            return unsubscribe
        }
    }, [db])

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  }
}));


const classes = useStyles();

  return (
    <div className={classes.root}>
      {user.posts ? <Badge color = 'primary' badgeContent={user.posts}>Posts</Badge> : <Badge  color = 'primary' badgeContent='0'>Posts</Badge>}
      {user.followers ? <Badge color = 'primary' badgeContent={user.followers}>Followers</Badge> : <Badge color = 'primary' badgeContent='0'>Followers</Badge>}
      {user.followed ? <Badge color = 'primary' badgeContent={user.followed}>Following</Badge> : <Badge  color = 'primary' badgeContent='0'>Following</Badge>}
    </div>
  );
}

export default MyProfileFollow
