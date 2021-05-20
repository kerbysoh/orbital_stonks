import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from './fire'
import 'firebase/firestore'

var prevUser = ''

const Chat = (props) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [receiver, setReceiver] = useState('')
    const [people, setPeople] = useState([])
    const [open, setOpen] = useState(false)
    const [messageDisplay, setMessageDisplay] = useState('')
    const [newUser, setNewUser] = useState(false)
    const [seeUser, setSeeUser] = useState(false)
    const [currUser, setCurrUser] = useState('')
    const db = firebase.firestore()
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
        setReceiver(prevUser)
        setNewUser(false)
        prevUser = receiver
    }
    return (
        <div>
        <button onClick = {newFunc}>View chats</button>
        <button onClick = {handleNew}>New chat</button>
        {currUser ? <> <h2>You're talking to: {currUser}</h2></> : <></>}
        {open ?  (<>
        {seeUser ? (<> <ul>
            {people.map((person) => {
            return (<li key = {person}><button onClick ={ () => {setMessageDisplay(person) ; setReceiver(person) ; setSeeUser(false); setCurrUser(person)} }>{person}</button></li>)
        })}
        </ul> </>) : (<></>)}

        
        <ul>
            {messages.map(message => {
                if ((userEmail === message.receiver || userEmail === message.email) && (messageDisplay === message.email || messageDisplay === message.receiver ) && (message.receiver !== '')) {
                    return (<li key = {message.id}>{message.email} {message.text}</li>) 
                }
                return <></>
                })}
        </ul>
        <form onSubmit = {handleOnSubmit}>
            {newUser ? <>
                <label>Send to: </label><input type = "text" value = {receiver} onChange = {handleReceiver}></input>
            </>
            : <></>
            }
            <label>Message: </label><input type = "text" value = {newMessage} onChange = {handleOnChange} placeholder = "Type your message here"></input>
            <button type = "submit" disabled = {!newMessage}>Send</button>
        </form>
        </>) : <></>}
        
        </div>
    )
}

export default Chat