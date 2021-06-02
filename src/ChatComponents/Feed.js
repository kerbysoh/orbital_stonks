import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import Navbar from '../components/Navbar'

const Feed = (props) => {
    const db = firebase.firestore()
    const [posts, setPosts] = useState([])
    const [friends, setFriends] = useState({})
    const [newPost, setNewPost] = useState('')
    const {handleLogout} = props
    const handleNewPost = () => {
        if (db){
            db.collection('Posts').add({
                text: newPost,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: fire.auth().currentUser.email,
                date: (new Date()).toString()
            }
            )
            setNewPost('')
        } 
    }
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
                if (Object.keys(friends).includes(post.email.slice(0,post.email.length - 4)) || (post.email === fire.auth().currentUser.email)) {
                    return (<li>{post.email} {post.text} Posted {post.date}</li>)
                } else {
                return null
                }})}
        </ul>
        </div>
        )
}

export default Feed