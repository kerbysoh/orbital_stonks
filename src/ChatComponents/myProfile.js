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
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MyProfileFollow from './myProfileFollow.js';


const useStyles = makeStyles({
  root: {
    maxWidth: 1500,
    margin: "auto",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(0, 105, 135, .3)",
    color: "white",
    padding: "0 30px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    color: 'black',
  },
  center: {
    color: 'black',
    marginLeft: '7.5rem'
  },
  email: {
    color: 'black',
    marginLeft: '3rem'
  },
  pos: {
    textAlign: "center",
    marginBottom: 24,
    color: "black",
  },
});

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    justifyContent:'left', 
      alignItems:'center',
  },
  sizeAvatar: {
    height: theme.spacing(40),
    width: theme.spacing(40),

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
    const [imageURL, setImageURL] = useState('')
    const calculate_age = (dob1) => {
      var today = new Date();
      var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
      var age_now = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age_now--;
      }
      console.log(age_now);
      return age_now;
    }
    const handleCopy = (content) => {
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
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
            var storage = firebase.storage()
    var pathReference = storage.ref(`images/${userEmail}`)
    pathReference.getDownloadURL().then((url) => {
      setImageURL(url)
    })
            return unsubscribe
        }
    }, [db])
return (<>
    <Navbar handleLogout = {handleLogout} />
     
    <Card className={classes.root}>
      <CardContent>
        
        
        <div className={avatarclasses.root}>
        <Avatar className = {avatarclasses.sizeAvatar} src = {imageURL}/>
        <MyProfileFollow></MyProfileFollow>
        </div>
        <Typography className={classes.center} variant = 'h6' color="textSecondary">
        {user.gender}, {calculate_age(user.dob)}
        </Typography>
        <Typography className={classes.email} variant = 'h6' color="textSecondary">
          <FileCopyIcon onClick = {() => {handleCopy(user.email)}} className = 'atIcon' color = 'black'></FileCopyIcon> {user.email}
        </Typography>
      </CardContent>
    </Card>
    </>
)
}

export default MyProfile




