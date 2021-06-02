import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'


const ViewFriends = () => {
    const db = firebase.firestore()
    const [friends, setFriends] = useState({})
    useEffect (() => {
        if (db) {
            const unsubscribe = db
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
        <>
        <button><Link to = '/Friends'>Add Friends</Link></button>
        {Object.values(friends).map((key, i) => {
            return (
                <h1 className = 'listFriends' key = {i}>
                    Name: {key.firstname} {key.lastname} Email: {key.email}
                    {/* Description: {key.Description}, 
                    Gender: {key.gender}, 
                    DOB: {key.dob.toDate().toDateString()} */}
                </h1>
            )
            
        })}
        </>
    )

}
export default ViewFriends