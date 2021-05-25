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
            [str] : currSearch.email
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

        <div>
            <button><Link to = '/viewfriends'>View friends</Link></button>
            <button><Link to = '/'>Home</Link></button>
            <SearchBox
        placeholder="Key in user email"
        handleChange={(e) => setSearch(e.target.value)}
        ></SearchBox>
        <button onClick={handleFriendSearch}> Search for user </button>
    <h1>{currSearch.email} {currSearch.firstname} {currSearch.lastname} {currSearch.gender} {currSearch.Description}</h1> 
    {(searchOn && currSearch.email !== userEmail) ? <button onClick = {handleAddFriend}>Follow</button> : <></>}

        </div>
    )
}
export default Friends