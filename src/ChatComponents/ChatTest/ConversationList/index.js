import React, { useState, useEffect } from "react";
import ConversationListItem from "../ConversationListItem";
import firebase from "firebase/app";
import fire from "../../../fire";
import "firebase/firestore";
import "./ConversationList.css";

export default function ConversationList(props) {
  const [messages, setMessages] = useState([]); // collection of latest 100 messages in database
  //const [messageDisplay, setMessageDisplay] = useState(""); //users of which messages to be displayed
  const db = firebase.firestore();
  const [friends, setFriends] = useState({});
  const { setMessageDisplay, setReceiver, setSeeUser, setCurrUser } = props;
  useEffect(() => {
    if (db) {
      const unsubscribe = db
        .collection("messages")
        .orderBy("createdAt")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(data);
        });
      db.collection("friends")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setFriends(doc.data());
          }
        });
      return unsubscribe;
    }
  }, [db]);

  return (
    <div className="conversation-list">
      {Object.values(friends).map((friend) => (
        <ConversationListItem
          data={friend}
          onClick={() => {
            setMessageDisplay(friend);
            setReceiver(friend);
            setSeeUser(false);
            setCurrUser(friend);
          }}
        />
      ))}
    </div>
  );
}
