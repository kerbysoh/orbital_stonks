import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import firebase from 'firebase/app'
import fire from '../../../fire'
import 'firebase/firestore'
import './ConversationList.css';

var prevUser = ''

export default function ConversationList(props) {
  const [messages, setMessages] = useState([]) // collection of latest 100 messages in database
  const [messageDisplay, setMessageDisplay] = useState('') //users of which messages to be displayed
  const db = firebase.firestore()
  const [friends, setFriends] = useState({})
  
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

    return (
      <div className="conversation-list">
        
        <ConversationSearch />
        {
          Object.values(friends).map(friend =>
            <ConversationListItem
              data={friend}
            />
          )
        }
      </div>
    );
}