import React, {useState, useEffect} from 'react';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import Navbar from "../components/Navbar"

const MyProfile = (props) => {
    const {handleLogout} = props
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [user, setUser] = useState([])
    useEffect (() => {
        if (db) {
            const unsubscribe = db
            db.collection('users')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) { 
                setUser(doc.data())
                }
                console.log(doc.data())
            })
            return unsubscribe
        }
    }, [db])
return (<>
    <Navbar handleLogout = {handleLogout} />
    <h1>Name : {user.firstname}</h1>
    <h1>Email: {user.email}</h1>
    <h1>Description: {user.Description}</h1>
    <h1>Gender: {user.gender}</h1>
    <h1>Born on:</h1>
    </>
)
}

export default MyProfile