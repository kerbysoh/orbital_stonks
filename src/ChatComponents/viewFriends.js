import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import {Link} from 'react-router-dom'


const ViewFriends = () => {
    const db = firebase.firestore()
    const [users, setUsers] = useState([])
    const [friends, setFriends] = useState({})
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
            .get()
            .then ((doc) => {
                if (doc.exists) {
                    console.log(doc.data());
                } 
                setFriends(doc.data())
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