import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'
import SearchBox from '../Search/SearchBox';


const Friends = () => {
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const [currSearch, setCurrSearch] = useState({})
    const [users, setUsers] = useState([])
    const [friends, setFriends] = useState([])
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
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                })) 
                setFriends(data)
            })
            
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
        var user = new Object()
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
            <button><Link to = '/'>Home</Link></button>
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

                {(searchOn && currSearch.email !== userEmail) ? 
                <clickfriends onClick = {handleAddFriend}>Follow
                </clickfriends> : <></>}
            </h3> : null
        }
            
            
        
        </div>
    )
}
export default Friends