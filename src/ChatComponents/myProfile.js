import React, {useState, useEffect} from 'react';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import Navbar from "../components/Navbar"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import MyProfileFollow from './myProfileFollow.js'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 'auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  pos: {
    textAlign: 'center',
    marginBottom: 24,
  },
});

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    justifyContent:'center', 
      alignItems:'center',
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const MyProfile = (props) => {
    const {handleLogout} = props
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [user, setUser] = useState([])
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const avatarclasses = useAvatarStyles();

    useEffect (() => {
        if (db) {
            const unsubscribe = db
            db.collection('users')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) { 
                setUser(doc.data())
                }
                console.log(doc.data())
            })
            return unsubscribe
        }
    }, [db])
return (<>
    <Navbar handleLogout = {handleLogout} />
     
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          My Profile
        </Typography>
        
        <div className={avatarclasses.root}>
        <Avatar className = 'avatar'>{user.data}</Avatar>
        <MyProfileFollow></MyProfileFollow>
        </div>
        <Typography className={classes.center} variant="h5" component="h2">
          {user.firstname} {user.lastname}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {user.email}
        </Typography>
        <Typography className={classes.center} variant="body2" component="p">
          {user.Description}
          <br />
          {user.gender}
          <br />
          Born on: {user.dob}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
    </>
)
}

export default MyProfile




