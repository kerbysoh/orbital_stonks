import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import fire from "../fire";
import { Link } from "react-router-dom";
import "firebase/firestore";
import UserAvatar from "./userAvatar";
import Navbar from "../components/Navbar";
import SearchBox from "../Search/SearchBox";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatTest from "./ChatTest/Messenger";
import "./ChatTest/ConversationSearch/ConversationSearch.css";
import "./ChatTest/Message/Message.css";
import "./ChatTest/Messenger/Messenger.css";
import ConversationListItem from "./ChatTest/ConversationListItem";
import "./ChatTest/ConversationListItem/ConversationListItem.css";
import Toolbar from "./ChatTest/Toolbar";
import { CenterFocusStrongOutlined, ShowChartTwoTone } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import InputEmoji from "react-input-emoji";

var prevUser = "";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 1200,
    display: "flex",
  },
}));

const Chat = (props) => {
  const handleClose = () => {
    setDOpen(false);
    setMsgSel("");
  };
  const [users, setUsers] = useState([])
  const [dOpen, setDOpen] = useState(false);
  const [messages, setMessages] = useState([]); // collection of latest 100 messages in database
  const [newMessage, setNewMessage] = useState(""); // new message string
  const [receiver, setReceiver] = useState(prevUser); //who receives the new message
  const [people, setPeople] = useState([]); //list of users currently having chats with
  const [open, setOpen] = useState(false); // boolean to store whether or not to display chat and input boxes
  const [messageDisplay, setMessageDisplay] = useState(""); //users of which messages to be displayed
  const [newUser, setNewUser] = useState(false); //boolean to store whether new chat is initiated
  const [seeUser, setSeeUser] = useState(false); // display users talking to
  const [currUser, setCurrUser] = useState(""); // current user of which messages are displayed -> for "You are talking to ..."
  const [errMsgSearch, setErrMsgSearch] = useState("");
  const [search, setSearch] = useState("");
  const db = firebase.firestore();
  const [errMsg, setErrMsg] = useState("");
  const [friends, setFriends] = useState({});
  const [msgSel, setMsgSel] = useState("");
  const { handleLogout , profile, setProfile, setUserz, userz} = props;
  const userEmail = fire.auth().currentUser.email;
  const [showchat, setShowChat] = useState(false);
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [openmenu, setOpenMenu] = useState(true);
  const [opensnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("User is Not Your Friend");
 
  
  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };
  const handleOpenMenu = () => {
    setOpenMenu(true);
  };
const handleData2 = (email) => {
  var user2;

    users.map((user) => {
      if (user.id === email) {
        user2 = user;
      }
    });
    if (user2) {
      return (
        <>
         {user2.firstname} {user2.lastname}
          <h4 className = "username2">{user2.Description}</h4>
          
        </>
      );
    }
}

  const newFunc = () => {
    setErrMsg("");
    setCurrUser("");
    setSeeUser(true);
    setNewMessage("");
    setReceiver("");
    setOpen(true);
    setNewUser(false);
    let x = [];
    for (const y of messages) {
      if (userEmail === y.receiver && !x.includes(y.email)) {
        x.push(y.email);
      }
      if (userEmail === y.email && !x.includes(y.receiver)) {
        x.push(y.receiver);
      }
    }
    setPeople(x);
  };
  const handleData = (email) => {
    var user2;

    users.map((user) => {
      if (user.id === email) {
        user2 = user;
      }
    });
    if (user2) {
      return (
        <>
          <Link to="userProfile" onClick={() => {
                setProfile(email);
                setUserz(user2);
              }}className="userData">
          
            {user2.firstname} {user2.lastname}{" "}
          </Link>
        </>
      );
    }
  };
  const handleNew = () => {
    setCurrUser("");
    setSeeUser(false);
    setReceiver("");
    setNewMessage("");
    setOpen(true);
    setMessageDisplay("");
    setNewUser(true);
  };

  useEffect(() => {
    let x = [];
    for (const y of messages) {
      if (userEmail === y.receiver && !x.includes(y.email)) {
        x.push(y.email);
      }
      if (userEmail === y.email && !x.includes(y.receiver)) {
        x.push(y.receiver);
      }
    }
    setPeople(x);

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
        db.collection("users")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setUsers(data);
        });
      return unsubscribe;
    }
  }, [db, messageDisplay. currUser]);

  const handleUserSearch = () => {
    messages.map((message) => {
      if (
        (search === message.email || search === message.receiver) &&
        search !== userEmail
      ) {
        setMessageDisplay(search);
        setOpen(true);
        setCurrUser(search);
        setReceiver(search);
        return;
      }
    });
  };

  const handleDelete = (e) => {
    db.collection("messages").doc(e).delete();
  };

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleReceiver = (e) => {
    setReceiver(e.target.value);
  };

  const showChat = () => {
      if(showchat){
        setShowChat(false);
      } else {
        setShowChat(true);
      }
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const key = receiver.slice(0, receiver.length - 4);
    console.log(friends);
    console.log(key);
    if (db && Object.keys(friends).includes(key)) {
      db.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        email: userEmail,
        receiver: receiver,
      });
      setNewMessage("");
      setNewUser(false);
      prevUser = receiver;
      setErrMsg("");
    } else {
      handleClickSnack();
    }
  };
  const [text, setText] = useState("");

  const handleOnEnter = (text) => {
    console.log("enter", text);
  }

  return (
    <div className="chatPage">
      <Navbar handleLogout={handleLogout} />
      <div class="topnav">
        <input
          className="searchbox"
          type="text"
          placeholder="Key in email..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <SearchIcon
          className="search2"
          onClick={handleUserSearch}
          fontSize="large"
        />
      </div>
      <div className="newChat">
        <Button
          variant="contained"
          color="black"
          className="postButton2"
          type="submit"
          onClick={handleNew}
        >
          New Chat
        </Button>
      </div>

      <h4 className="errmsgsearch"></h4>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={opensnack}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
        onClose={() => setOpenSnack(false)}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnack}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />

      <h1>{errMsg}</h1>

      <div className="messenger">
        <div className="content">
          <div className="conversation-list">
            <FormControl>
              <Button
                id="demo-controlled-open-select-label"
                onClick={() => {
                  newFunc();
                  showChat();
                }}
              >
                View Chats
              </Button>
            </FormControl>
            {showchat ? 
             people.map((person) => {
              return (
                <div
                  className="conversation-list-item"
                  onClick={() => {
                    setMessageDisplay(person);
                    setReceiver(person);
                    setCurrUser(person);
                    setSeeUser(true);
                  }}
                >
                  <div className="conversation">
                  <UserAvatar className = "avatar3" data={person} />
                  <h4 className = "username">{handleData2(person)}</h4>
                  </div>
                </div>
              );
            }): null}
            
          </div>
        </div>
        <div className="sidebar">
          <ul className="listMsg">
            <div className="chatHeader">
              {currUser ? (
                <>
                  {" "}
                  
                        <h3>{handleData(currUser)}</h3>
                </>
              ) : (
                <></>
              )}
            </div>

            {messages.map((message) => {
              if (
                (userEmail === message.receiver ||
                  userEmail === message.email) &&
                (messageDisplay === message.email ||
                  messageDisplay === message.receiver) &&
                message.receiver !== "" &&
                receiver !== ""
              ) {
                if (userEmail === message.receiver) {
                  return (
                    <li className="chatBubbleLeft" key={message.id}>
                      {message.text}{" "}
                    </li>
                  );
                } else {
                  return (
                    <li className="chatBubbleRight" key={message.id}>
                      {message.text}{" "}
                      <DeleteIcon
                        className="iconClass"
                        onClick={() => {
                          setDOpen(true);
                          setMsgSel(message.id);
                        }}
                      />
                    </li>
                  );
                }
              }
              return <></>;
            })}
          </ul>
          <form onSubmit={handleOnSubmit} className="form-container">
            {newUser ? (
              <>
                <div className="conversation-search">
                  <input
                    placeholder="Send to:"
                    type="text"
                    className="conversation-search-input"
                    value={receiver}
                    onChange={handleReceiver}
                  ></input>
                </div>
              </>
            ) : (
              <></>
            )}
            {currUser || newUser ? (
              <>
                <textarea
                  className="messagePosting"
                  type="text"
                  value={newMessage}
                  //value={text}
                  onChange={handleOnChange}
                  placeholder="Type message.."
                  name="msg"
                  required
                ></textarea>
                {/* <InputEmoji
                  value={text}
                  onChange={setText}
                  cleanOnEnter
                  onEnter={handleOnEnter}
                  maxLength = "5rem"
                /> */}
                <Button
                  variant="contained"
                  color="black"
                  className="postButton"
                  type="submit"
                  disabled={!newMessage}
                >
                  Send
                </Button>
              </>
            ) : (
              <></>
            )}
          </form>
          <Dialog
            open={dOpen}
            onClose={() => handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="Confirm Delete?">{"Confirm Delete?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Your action cannot be reversed
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="primary">
                No
              </Button>
              <Button
                onClick={() => {
                  handleDelete(msgSel);
                  handleClose();
                }}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Chat;
