import { Link }  from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from './fire'
import 'firebase/firestore'

const Chat = (props) => {
    const {user} = props
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [receiver, setReceiver] = useState('')
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    useEffect(() => {
        if (db) {
            const unsubscribe = db
            .collection('messages')
            .orderBy('createdAt')
            .limit(100)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                }))
                setMessages(data)
            })
            return unsubscribe
        }
    }, [db])
    const handleOnChange = e => {
        setNewMessage(e.target.value)
    }
    const handleReceiver = e => {
        setReceiver(e.target.value)
    }
    const handleOnSubmit = e => {
        e.preventDefault()
        if (db) {
            db.collection('messages').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: userEmail,
                receiver: receiver
            }
            )
        }
        setNewMessage('')
        setReceiver('')

    }
    return (
        <>
        <ul>
            {messages.map(message => (
                (userEmail == message.receiver || userEmail == message.email) ? (<li key = {message.id}>{message.email} {message.text}</li>) : <h4></h4>
            ))}
        </ul>
        <form onSubmit = {handleOnSubmit}>
            <label>Send to:  </label><input type = "text" value = {receiver} onChange = {handleReceiver}></input>
            <label>Message: </label><input type = "text" value = {newMessage} onChange = {handleOnChange} placeholder = "Type your message here"></input>
            <button type = "submit" disabled = {!newMessage}>Send</button>
        </form>
        </>
    )
}

export default Chat