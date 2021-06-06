import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import Navbar from '../components/Navbar'
import SearchBox from '../Search/SearchBox'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';

var prevUser = ''

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 1200,
  },
}));

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
    const [errMsgSearch, setErrMsgSearch] = useState('')
    const [search, setSearch] = useState('')
    const db = firebase.firestore()
    const [errMsg, setErrMsg] = useState('')
    const [friends, setFriends] = useState({})
    const {handleLogout} = props
    const userEmail = fire.auth().currentUser.email

    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [openmenu, setOpenMenu] = useState(false);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };
    
    const newFunc = () => {
        setErrMsg('')
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
            db.collection('friends')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setFriends(doc.data())
                } 
            })
            return unsubscribe
        }
    }, [db, messageDisplay])
    const handleUserSearch = () => {
        messages.map((message) => {
            if ((search === message.email || search === message.receiver) && search !== userEmail) {
                setMessageDisplay(search)
                setOpen(true)
                setCurrUser(search)
                setReceiver(search)
                return
            }
            
        })
        
    }
    const handleDelete = (e) => {
        db.collection("messages").doc(e).delete()
    }
    const handleOnChange = e => {
        setNewMessage(e.target.value)
    }
    const handleReceiver = e => {
        setReceiver(e.target.value)
    }
    const handleOnSubmit = e => {
        e.preventDefault()
        const key = receiver.slice(0, receiver.length - 4)
        console.log(friends)
        console.log(key)
        if ((db) && (Object.keys(friends).includes(key))){
            db.collection('messages').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: userEmail,
                receiver: receiver
            }
            )
            setNewMessage('')
            setNewUser(false)
            prevUser = receiver
            setErrMsg('')
        } else {
            setErrMsg('User is not your friend')
        }
    }
    return (
        
        <div  className="chatPage">
        <Navbar handleLogout = {handleLogout} />
        <SearchBox
                placeholder= "Key in email"
                handleChange={(e) => {
                    setSearch(e.target.value)
                }}
              ></SearchBox>
              <button
                onClick={handleUserSearch}
                className = "clickfriends"
              >Search</button>
        <h4 className = "errmsgsearch">{errMsgSearch}</h4>
        
        
        <FormControl className={classes.formControl} >
        <InputLabel id="demo-controlled-open-select-label">View Chats</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          openmenu={openmenu}
          onClose={handleCloseMenu}
          onOpen={() => {handleOpenMenu() ; newFunc()}}
          value={email}
          onChange={() => {handleChange()}}
        >
            {open ?  (<>
                {seeUser ? (<> <ul>
                {people.map((person) => {
                return (
                <li className = "listPeople" key = {person}>
                        <MenuItem onClick ={ () => {setMessageDisplay(person) ; setReceiver(person) ; setSeeUser(false); setCurrUser(person)} } value={person}>{person}</MenuItem>
                    </li>
                    )
                })}
            </ul> </>) : (<></>)}
        </>) : <></>}
        </Select>
      </FormControl>
      <button className="open-button" onClick={handleNew}>New Chat</button>



      {currUser ? <> <h2 className = 'chatTitle'>{currUser}</h2></> : <></>}
            
        <ul className = 'listMsg'>
            {messages.map((message) => {
                if ((userEmail === message.receiver || userEmail === message.email) && (messageDisplay === message.email || messageDisplay === message.receiver ) && (message.receiver !== '') && (receiver !== '')) {
                    if (userEmail === message.receiver) { 
                        return (<li className = 'chatBubbleLeft' key = {message.id}>{message.text} </li>) 
                    } else {
                        return (<li className = 'chatBubbleRight' key = {message.id}>{message.text} <DeleteIcon onClick = {() => handleDelete(message.id)} /></li>)
                    }
            
                }
                return <></>
                })}
        </ul>
        <form onSubmit = {handleOnSubmit} className ="form-container">
            {newUser ? <>
                <label for="msg"><b>Send to: </b></label>
                <input type = "text" className = "messageContainer" value = {receiver} onChange = {handleReceiver} ></input>
            </>
            : <></>
            }
            {(currUser || newUser) ? <>
            <textarea className = "messageSend" type = "text" value = {newMessage} onChange = {handleOnChange} placeholder="Type message.." name="msg" required></textarea>
            <button className = "sendMessage" type = "submit" disabled = {!newMessage}>Send</button></> : <></>}
        </form>
        <h1>{errMsg}</h1>
        </div>
    )
}

export default Chat