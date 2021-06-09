import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import Navbar from '../components/Navbar'
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

const Feed = (props) => {
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
    const [comments, setComments] = useState([])
    const {handleLogout} = props
    const increment = firebase.firestore.FieldValue.increment(1)
    const decrement = firebase.firestore.FieldValue.increment(-1)


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
                postID: currReply
            
            })
        }
    }
    const handleDeletePost = (e) => {
        db.collection("Posts").doc(e).delete()
        db.collection("Likes").doc(e).delete()
        db.collection("Comments").doc(e).delete()
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
            }}})}
    const handleOnChange = e => {
        setNewPost(e.target.value)
        
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
        
        <textarea className = "post" type = "text" value = {newPost} onChange = {handleOnChange} placeholder="How are you feeling today?" name="msg" required></textarea>
        <button className = "postButton" type = "submit" disabled = {!newPost} onClick = {handleNewPost}>Post</button>

        <ul className = 'listMsg'>
            {posts.map((post) => {
                if (Object.keys(friends).includes(post.email.slice(0,post.email.length - 4)) || (post.email === fire.auth().currentUser.email)) 
                {
                    if (currView === post.id) {
                        return comments.map((comment) => {
                            if (comment.postID === currView) {
                            return <h4>{comment.email} {comment.text} Replied {comment.date}</h4>
                            }
                        }
                        )
                    }
                    return (<li>{post.email} {post.text} Posted {post.date} <FavoriteIcon onClick = {() => handleLike(post.id)}/><DeleteIcon onClick = {() => handleDeletePost(post.id)} /><Button onClick = {() => {setCurrView(post.id) ; setReply(''); setReplyOn(false)}}>View Comments</Button><Button onClick = {() => {setReplyOn(true); setCurrReply(post.id)}}>Reply</Button><h1>{post.likes} likes</h1></li>)
                } else {
                return null
                }})}
        </ul>
        {replyOn ? <> <TextField onChange = {(e) => setReply(e.target.value) }></TextField> <Button onClick = {() => handleReply()}>Submit</Button> </>: <></>}
        </div>
        )
}

export default Feed