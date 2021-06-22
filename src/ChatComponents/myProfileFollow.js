import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import "firebase/firestore";
import firebase from "firebase/app";
import fire from "../fire";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const MyProfileFollow = () => {
  const db = firebase.firestore();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (db) {
      const unsubscribe = db;
      db.collection("users")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUser(doc.data());
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
      marginLeft: "7rem",

      marginTop: "0rem",
    },
    badge: {
      marginLeft: "7rem",
      marginRight: "6rem",
      marginTop: "0rem",
      fontSize: 30,
    },
    Description: {
      marginTop: "=1rem",
      display: "flex",
      marginLeft: "7rem",
      fontSize: 20,
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.center} variant="h3" component="h2">
        {user.firstname} {user.lastname}{" "}
        <Button variant="contained" color="primary" className="editButton">
          Edit Profile
        </Button>
      </Typography>

      {<span className={classes.badge}> {user.posts} Posts</span>}
      {<span className={classes.badge}> {user.followers} Followers</span>}
      {<span className={classes.badge}> {user.followed} Following</span>}
      <span className={classes.Description}>{user.Description}</span>
    </div>
  );
};

export default MyProfileFollow;
