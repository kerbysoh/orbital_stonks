import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import Navbar from '../components/Navbar'
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
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
      height: theme.spacing(5),
      width: theme.spacing(5),
      marginLeft: '1rem',
      marginTop: '1rem',
      display: 'inline-block'
  
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

const UserAvatar = (props) => {
    const {data} = props
    const [imageURL, setImageURL] = useState('')
    useEffect (() => {
        
            var storage = firebase.storage()
    var pathReference = storage.ref(`images/${data}`)
    pathReference.getDownloadURL().then((url) => {
      setImageURL(url)
    })
        }, [imageURL])
    const avatarclasses = useAvatarStyles();
    const classes = useStyles()
    return (
        <>
        <Avatar className = {avatarclasses.sizeAvatar} src = {imageURL}/>
        </>
    )
}
export default UserAvatar