import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'
import SearchBox from '../Search/SearchBox'
import Navbar from '../components/Navbar'



const Friends = (props) => {
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const [currSearch, setCurrSearch] = useState({})
    const [users, setUsers] = useState([])
    const [friends, setFriends] = useState({})
    const {handleLogout} = props
    const [searchOn, setSearchOn] = useState(false)
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
    const handleAddFriend = () => {
        var str = currSearch.email
        str = str.slice(0, str.length - 4)
        db.collection("friends").doc(`${userEmail}`).update({
            [str] : currSearch
        })
    }
    const handleFriendSearch = () => {
        setSearchOn(false)
        var user = {}
        for (const x of users) {
            if (x.email === search) {
                user = x
                setSearchOn(true)
            }
        }
        setCurrSearch(user)
    }
    return (

        <div className = "chatPage">
        <Navbar handleLogout = {handleLogout} />
            <button><Link to = '/viewfriends'>View Followed Friends</Link></button>
        <SearchBox className = "friendSearch"
        placeholder="Key in user email"
        handleChange={(e) => setSearch(e.target.value)}
        ></SearchBox>
        <clickfriends onClick={handleFriendSearch}> Search for user </clickfriends>
        {
            searchOn ?
            <h3> 
            
                Suggested: {currSearch.email} {currSearch.firstname} {currSearch.lastname} {currSearch.gender} {currSearch.Description}

                {(searchOn && currSearch.email !== userEmail && !(Object.keys(friends).includes(currSearch.email.slice(0,currSearch.email.length - 4))) ) ? 
                <clickfriends onClick = {handleAddFriend}>Follow
                </clickfriends> : <><h3>Already followed</h3></>}
            </h3> : null
        }
            
            
        
        </div>
    )
}
export default Friends