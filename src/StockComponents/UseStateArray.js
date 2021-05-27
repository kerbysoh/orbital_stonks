import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

const UseStateArray =() => {
    const db = firebase.firestore()
    const [stock, setStock] = useState([]);
    const [users, setUsers] = useState([])

    useEffect (()=> {
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
            db.collection('Stocks')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log(doc.data());
                } 
                setStock(doc.data())
            })
            
            return unsubscribe
        }
    }, [db])
    
    const removeItem = (id) => {
        db.collection("Stocks").doc(fire.auth().currentUser.email).update({
            [id]: firebase.firestore.FieldValue.delete()
        })
        db.collection('Stocks').doc(fire.auth().currentUser.email).get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection('Stocks').doc(fire.auth().currentUser.email).set({})
        }
    })
};
    return (
        <>
            {Object.values(stock).map((key, i) => {
                return (
                    <h1 key = {i}>
                        Stock: {key}
                        <click onClick ={() => removeItem(key)}>Remove</click>
                    </h1>
                )
                
            })}
        </>
    );
};

export default UseStateArray;
