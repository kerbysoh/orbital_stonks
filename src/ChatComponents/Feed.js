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
const Feed = (props) => {
    const avatarclasses = useAvatarStyles();
    const classes = useStyles()
    const db = firebase.firestore()
    const [currReply, setCurrReply] = useState('')
    const [posts, setPosts] = useState([])
    const [friends, setFriends] = useState({})
    const [newPost, setNewPost] = useState('')
    const [errMsg, setErrmsg] = useState('')
    const [likes, setLikes] = useState({})
    const [replyOn, setReplyOn] = useState(false)
    const [currView, setCurrView] = useState('')
    const [reply, setReply] = useState('')
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const {handleLogout, profile, setProfile} = props

    const increment = firebase.firestore.FieldValue.increment(1)
    const decrement = firebase.firestore.FieldValue.increment(-1)
    const handleData =  (email) => {
    var user2;
    var imageURL = 'x'
    
       users.map((user) => {
           if (user.id === email) {
               user2 = user
           }
       }
       )
       if (user2) {
        
       return <>
       <Link to = 'userProfile' className = 'userData' onClick = {() => {setProfile(email)}}> {user2.firstname} {user2.lastname} </Link>
       </>
    }
}
    const handleNewPost = () => {
    
        if (db){
            db.collection('Posts').add({
                text: newPost,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: fire.auth().currentUser.email,
                date: (new Date()).toString(),
                likes: 0
            }).then(function(docRef) {
                db.collection('Likes').doc(docRef.id).set({})
            })
            db.collection('users').doc(fire.auth().currentUser.email).update({
                posts: increment
            })
            setNewPost('')
        } 

    }
    const handleReply = () => {
        if (db) {
            db.collection('Comments').add({
                text: reply,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: fire.auth().currentUser.email,
                date: (new Date()).toString(),
                postID: currReply,
                likes: 0
            })
        }
        setReplyOn(false)
        setCurrView(currReply)
    }
    const handleDeletePost = (e) => {
        db.collection("Posts").doc(e).delete()
        db.collection("Likes").doc(e).delete()
        comments.map((comment) => {
            if (comment.postID === e) {
                db.collection('Comments').doc(comment.id).delete()
            }
        }
        
        )
        db.collection('users').doc(fire.auth().currentUser.email).update({
            posts: decrement
        })
        setReplyOn(false)

    }
    const handleLike = (x) => {
        const q = fire.auth().currentUser.email
        const self = q.slice(0, q.length - 4)
        
        db.collection('Likes').doc(x).get().then((doc) => {
            if (doc.exists) {
                const keys = Object.keys(doc.data())
                if (!(keys.includes(self))) {
                    db.collection("Likes").doc(x).set({
                        [self]: fire.auth().currentUser.email
                    })
                    db.collection("Posts").doc(x).update({
                        likes: increment
                    })
                } else {
                    db.collection("Likes").doc(x).update({
                        [self] : firebase.firestore.FieldValue.delete()
                    })
                    db.collection("Posts").doc(x).update({
                        likes: decrement
                    })
                    db.collection('Likes').doc().get(x)
                    .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection('Likes').doc(x).set({})
            }})
            }}})
            setReplyOn(false)}
    const handleOnChange = e => {
        setNewPost(e.target.value)
        
    }
    const handleDeleteComment = (e) => {
        db.collection("Comments").doc(e).delete()
    }
    useEffect (() => {
        if (db) {
            const unsubscribe = db
            db.collection('Posts')
            .orderBy('createdAt')
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                })) 
                setPosts(data)
            })
            db.collection('users')
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                })) 
                setUsers(data)
            })
            db.collection('friends')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) { 
                setFriends(doc.data())
                }
            })
            db.collection('Likes')
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                })) 
                setLikes(data)
            })
            db.collection('Comments')
            .orderBy('createdAt')
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                })) 
                setComments(data)
            })
            return unsubscribe  
        }
    }, [db])
    
    return (
        <div>
        <Navbar handleLogout = {handleLogout} />
        <form className = 'postForm'>
        <textarea className = "post" type = "text" value = {newPost} onChange = {handleOnChange} placeholder = "What's on your mind?" name="msg" required></textarea>
        <Button variant = "contained" color = 'primary' className = 'postButton' type = "submit" onClick = {handleNewPost}>Post</Button>
        </form>
        <div className = {classes.root}>
        <Grid className = 'listMsg' container spacing = {3}>
            {posts.map((post) => {
                if (Object.keys(friends).includes(post.email.slice(0,post.email.length - 4)) || (post.email === fire.auth().currentUser.email)) 
                {
                    return (
                        <><div class="post3">
                        <div class="header__left">
                        <div class="post__author author">
                          <span class="author__name">
                              
                         {handleData(post.email)}
                         
                          </span>
                        </div>
                        <span class="post__date">
                          Posted {post.date}
                        </span>
                      </div>
                    <Grid className = 'post2' item xs = {12}><p className = 'content'> {post.text} </p> <div class="post__footer footer"><span className = 'likes'>{post.likes} likes</span></div><FavoriteIcon className = 'like-button' onClick = {() => handleLike(post.id)}/>{(post.email === fire.auth().currentUser.email) ? <><DeleteIcon className = 'like-button'  onClick = {() => handleDeletePost(post.id)} /></> : null}<Button className = "clickfriends" onClick = {() => {setCurrView(post.id) ; setReply(''); setReplyOn(false)}}>View Comments</Button><Button className = "clickfriends" onClick = {() => {setReplyOn(true); setCurrReply(post.id)}}>Reply</Button> 
                    {(currView === post.id) ?<> {
                        comments.map((comment) => {
                            if (comment.postID === currView) {
                            return <h4>{comment.email} {comment.text} Replied {comment.date}{(comment.email === fire.auth().currentUser.email) ? <><DeleteIcon onClick = {() => handleDeleteComment(comment.id)} /></> : null} </h4>
                            }
                            return null
                        }
                        )
                    }</> : null}
                    </Grid>
                    </div>
                    </>)
                } else {
                return null
                }})}
        </Grid>
</div>
        {replyOn ? <> <TextField variant = 'filled' size = 'medium' onChange = {(e) => setReply(e.target.value) }></TextField> <Button className = 'clickfriends' onClick = {() => handleReply()}>Submit</Button> </>: <></>}
        </div>
        )
}

export default Feed