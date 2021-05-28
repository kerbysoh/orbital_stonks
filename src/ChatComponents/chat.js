import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import {Link} from 'react-router-dom'
import fire from '../fire'
import 'firebase/firestore'
import Navbar from '../components/Navbar'
var prevUser = ''

const Chat = (props) => {
    const [messages, setMessages] = useState([]) // collection of latest 100 messages in database
    const [newMessage, setNewMessage] = useState('') // new message string
    const [receiver, setReceiver] = useState(prevUser) //who receives the new message
    const [people, setPeople] = useState([]) //list of users currently having chats with
    const [open, setOpen] = useState(false) // boolean to store whether or not to display chat and input boxes
    const [messageDisplay, setMessageDisplay] = useState('') //users of which messages to be displayed
    const [newUser, setNewUser] = useState(false) //boolean to store whether new chat is initiated
    const [seeUser, setSeeUser] = useState(false) // display users talking to
    const [currUser, setCurrUser] = useState('') // current user of which messages are displayed -> for "You are talking to ..."
    const db = firebase.firestore()
    const {handleLogout} = props
    const userEmail = fire.auth().currentUser.email

    const newFunc = () => {
        setCurrUser('')
        setSeeUser(true)
        setNewMessage('')
        setReceiver('')
        setOpen(true)
        setNewUser(false)
        let x = []
        for (const y of messages) {
            if(userEmail === y.receiver && !x.includes(y.email) ) {
                x.push(y.email)
            }
            if (userEmail === y.email && !x.includes(y.receiver)) {
                x.push(y.receiver)
            }
        }
        setPeople(x)
    }
    const handleNew = () => {
        setCurrUser('')
        setSeeUser(false)
        setReceiver('')
        setNewMessage('')
        setOpen(true)
        setMessageDisplay('')
        setNewUser(true)
        setPeople([])
    }

    useEffect(() => {
        if (db) {
            const unsubscribe = db
            .collection('messages')
            .orderBy('createdAt')
            .limit(10000)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
    
                }))
                setMessages(data)
            })
            return unsubscribe
        }
    }, [db, messageDisplay])
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
        setNewUser(false)
        prevUser = receiver
    }
    return (
        
        <div  className="chatPage">
        <Navbar handleLogout = {handleLogout} />
        <button onClick = {newFunc}>View chats</button>
        <button class="open-button" onClick={handleNew}>New Chat</button>
        {currUser ? <> <h2 className = 'chatTitle'>{currUser}</h2></> : <></>}

        {open ?  (<>
        {seeUser ? (<> <ul>
            {people.map((person) => {
            return (
            <li className = "listPeople" key = {person}>
                <button onClick ={ () => {setMessageDisplay(person) ; setReceiver(person) ; setSeeUser(false); setCurrUser(person)} }>
                    {person}
                </button>
                </li>
                )
        })}
        </ul> </>) : (<></>)}

        
        <ul className = 'listMsg'>
            {messages.map((message) => {
                if ((userEmail === message.receiver || userEmail === message.email) && (messageDisplay === message.email || messageDisplay === message.receiver ) && (message.receiver !== '') && (receiver !== '')) {
                    return (<li key = {message.id}>{message.email} {message.text}</li>) 
                }
                return <></>
                })}
        </ul>
        <form onSubmit = {handleOnSubmit} class="form-container">
            {newUser ? <>
                <label for="msg"><b>Send to: </b></label>
                <input type = "text" value = {receiver} onChange = {handleReceiver} ></input>
            </>
            : <></>
            }
            {(currUser || newUser) ? <>
            <label for="msg"><b>Message</b></label>
            <textarea type = "text" value = {newMessage} onChange = {handleOnChange} placeholder="Type message.." name="msg" required></textarea>
            <button type = "submit" disabled = {!newMessage}>Send</button></> : <></>}
        </form>
        </>) : <></>}
        
        </div>
    )
}

export default Chat