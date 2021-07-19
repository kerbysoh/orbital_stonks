import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import "firebase/firestore";
import firebase from "firebase/app";
import fire from "../fire";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const MyProfileFollow = () => {
  const db = firebase.firestore();
  const [user, setUser] = useState({});

  const [editing, setEditing] = useState(false);
  const [newfirstname, setNewFirstName] = useState("");
  const [newlastname, setNewLastName] = useState("");
  const [newgender, setNewGender] = useState("");
  const [newdescription, setNewDescription] = useState("");
  const [newbirthday, setNewBirthday] = useState("");

  useEffect(() => {
    if (db) {
      const unsubscribe = db;
      db.collection("users")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUser(doc.data());
            setNewFirstName(doc.data().firstname);
            setNewLastName(doc.data().lastname);
            setNewGender(doc.data().gender);
            setNewDescription(doc.data().Description);
            setNewBirthday(doc.data().dob);


          }
        });

      return unsubscribe;
    }
  }, [db]);

  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(2),
        color: "black",
      },
      fontSize: 30,
    },
    center: {
      marginLeft: "6rem",

      marginTop: "0rem",
    },
    badge: {
      marginLeft: "6rem",
      marginRight: "6rem",
      marginTop: "0rem",
      fontSize: 25,
    },
    Description: {
      marginTop: "1rem",
      display: "flex",
      marginLeft: "26rem",
      fontSize: 20,
    },
    changes: {
      display: "center",
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {editing ? (
        <div className={classes.changes}>
          <br />

          <input
            className="searchbox"
            type="text"
            value={newfirstname}
            onChange={(e) => {
              setNewFirstName(e.target.value);
            }}
          />
          <TextField
            onChange={(e) => {
              setNewFirstName(e.target.value);
            }}
            id="date"
            label="Birth Date"
            type="date"
            value={newbirthday}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <input
            className="searchbox"
            type="text"
            value={newlastname}
            onChange={(e) => {
              setNewLastName(e.target.value);
            }}
          />
          <br />
          <input
            className="searchbox"
            type="text"
            value={newgender}
            onChange={(e) => {
              setNewGender(e.target.value);
            }}
          />
          <br />
          <input
            className="searchbox"
            type="text"
            value={newdescription}
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
          />
          <br />
          <TextField
            onChange={(e) => {
              setNewBirthday(e.target.value);
            }}
            id="date"
            label="Birth Date"
            type="date"
            value={newbirthday}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <Button
            variant="contained"
            color="black"
            className="editButton"
            onClick={() => setEditing(false)}
          >
            Confirm
          </Button>
        </div>
      ) : (
        <>
          <Typography className={classes.center} variant="h3" component="h2">
            {user.firstname} {user.lastname}{" "}
            <Button
              variant="contained"
              color="black"
              className="editButton"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </Typography>
          <span className={classes.badge}> {user.posts} Posts</span>
          <span className={classes.badge}> {user.followers} Followers</span>
          <span className={classes.badge}> {user.followed} Following</span>
          <br />
          <span className={classes.Description}>{user.Description}</span>
        </>
      )}
    </div>
  );
};

export default MyProfileFollow;
