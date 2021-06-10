import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'
import SearchBox from '../Search/SearchBox'
import Navbar from '../components/Navbar'
import Button from '@material-ui/core/Button'


const Friends = (props) => {
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const [currSearch, setCurrSearch] = useState({})
    const [users, setUsers] = useState([])
    const [friends, setFriends] = useState({})
    const {handleLogout} = props
    const [searchOn, setSearchOn] = useState(false)
    const [self, setSelf] = useState({})
    const increment = firebase.firestore.FieldValue.increment(1)
    const decrement = firebase.firestore.FieldValue.increment(-1)
    useEffect (() => {
        if (db) {
            const unsubscribe = db
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
            return unsubscribe
        }
    }, [db])

    const handleUnfollow = () => {
        var str = currSearch.email
        str = str.slice(0, str.length - 4)
        var str2 = userEmail
        str2 = str2.slice(0, str.length - 4)
        db.collection("users").doc(currSearch.email).update({
            followers: decrement
        })
        db.collection("users").doc(`${userEmail}`).update({
            followed: decrement
        })
        currSearch.followers -= 1
        self.followed -= 1
        db.collection("friends").doc(`${userEmail}`).update({
            [str] : firebase.firestore.FieldValue.delete()
        })

        db.collection("followers").doc(currSearch.email).update({
            [str2] : firebase.firestore.FieldValue.delete()
        })
        db.collection('followers').doc().get(currSearch.email)
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection('followers').doc(currSearch.email).set({})
        }
    })
    db.collection("friends").doc().get(`${userEmail}`)
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection("friends").doc(`${userEmail}`).set({})
        }
    })
    }
    
    const handleAddFriend = () => {
        var str = currSearch.email
        str = str.slice(0, str.length - 4)
        var str2 = userEmail
        str2 = str2.slice(0, str2.length - 4)
        db.collection("users").doc(currSearch.email).update({
            followers: increment
        })
        db.collection("users").doc(`${userEmail}`).update({
            followed: increment
        })
        currSearch.followers += 1
        self.followed += 1
        db.collection("friends").doc(`${userEmail}`).update({
            [str] : currSearch
        })

        db.collection("followers").doc(currSearch.email).update({
            [str2] : self
        })

        
    }
    const handleFriendSearch = () => {
        setSearchOn(false)
        var user = {}
        var user2 = {}
        for (const x of users) {
            if (x.email === search) {
                user = x
                setSearchOn(true)
            }
            if (x.email === userEmail) {
                user2 = x
            }
        }
        setCurrSearch(user)
        setSelf(user2)
    }
    return (

        <div className = "chatPage">
        <Navbar handleLogout = {handleLogout} />
            <button><Link to = '/viewfriends'>View Followed Friends</Link></button>
        <SearchBox className = "friendSearch"
        placeholder="Key in user email"
        handleChange={(e) => setSearch(e.target.value)}
        ></SearchBox>
        <Button onClick={handleFriendSearch} variant="contained" color="primary" className = "clickfriends"> Search </Button>
        {
            searchOn ?
            <h3> 
            
                Suggested: {currSearch.email} {currSearch.firstname} {currSearch.lastname} {currSearch.gender} {currSearch.Description}

                {(searchOn && currSearch.email !== userEmail && !(Object.keys(friends).includes(currSearch.email.slice(0,currSearch.email.length - 4))) ) ? 
                <Button className = "clickfriends" variant = "contained" color = "secondary" onClick = {handleAddFriend}>Follow
                </Button> :<> {(currSearch.email !== userEmail) ? <> <Button className = "clickfriends" variant = "contained" color = "secondary" onClick = {handleUnfollow}>Unfollow
                </Button> </>: <><h1>You</h1></>}</>}
            </h3> : null
        }
            
            
        
        </div>
    )
}
export default Friends