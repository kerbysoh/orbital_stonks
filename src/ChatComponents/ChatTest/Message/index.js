import React from "react";
import "./Message.css";
import DeleteIcon from "@material-ui/icons/Delete";

export default function Message(props) {
  const { db, messages, userEmail, messageDisplay, receiver } = props;

  const handleDelete = (e) => {
    db.collection("messages").doc(e).delete();
  };

  return <div>hello</div>;
}
