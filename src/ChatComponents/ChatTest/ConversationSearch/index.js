import React, {useState} from 'react';
import './ConversationSearch.css';
import SearchBox from '../../../Search/SearchBox'
import firebase from 'firebase/app'
import fire from '../../../fire'
import 'firebase/firestore'

var prevUser = ''

export default function ConversationSearch() {
    const [search, setSearch] = useState('')
    const [messages, setMessages] = useState([]) // collection of latest 100 messages in database
    const userEmail = fire.auth().currentUser.email
    const [messageDisplay, setMessageDisplay] = useState('') //users of which messages to be displayed
    const [open, setOpen] = useState(false) // boolean to store whether or not to display chat and input boxes
    const [currUser, setCurrUser] = useState('') // current user of which messages are displayed -> for "You are talking to ..."
    const [errMsgSearch, setErrMsgSearch] = useState('')
    const [receiver, setReceiver] = useState(prevUser) //who receives the new message

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
    return (
      
      <div className="conversation-search">
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
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search for..."
        />
      </div>
    );
}