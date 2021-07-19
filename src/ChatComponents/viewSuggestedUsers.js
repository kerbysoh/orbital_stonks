import React, { useState, useEffect } from "react";
import "firebase/firestore";
import firebase from "firebase/app";
import fire from "../fire";
import { Link } from "react-router-dom";
import SearchBox from "../Search/SearchBox";
import Navbar from "../components/Navbar";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import ViewFriends from "./viewFriends";
import FriendsStock from "../StockComponents/FriendsStock";
import { Typography, Grid, makeStyles, Avatar } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import ViewSuggested from "./viewSuggestedUsers";
import Av from "./userAvatar2";
import Toolbar from "./ChatTest/Toolbar";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(10),
  },
  root: {
    border: `1px solid ${theme.palette.secondary[400]}`,
    padding: theme.spacing(2),
    borderRadius: "2px",
    maxWidth: 200,
  },
  header: {
    color: theme.palette.grey[400],
    height: "15px",
  },
  photoContainer: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  verified: {
    height: 20,
  },
  channelUserName: {
    fontWeight: theme.typography.fontWeightBold,
  },
  chanelNameContainer: {
    marginBottom: theme.spacing(1),
  },
  followButton: {
    textTransform: "none",
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),
    fontWeight: theme.typography.fontWeightMedium,
  },
  Suggested: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const Suggested = (props) => {
  const [self, setSelf] = useState({});
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
  const handleAddFriend = (currSearch) => {
    var str = currSearch.email;
    str = str.slice(0, str.length - 4);
    var str2 = userEmail;
    str2 = str2.slice(0, str2.length - 4);
    db.collection("users").doc(currSearch.email).update({
      followers: increment,
    });
    db.collection("users").doc(`${userEmail}`).update({
      followed: increment,
    });
    currSearch.followers += 1;
    self.followed += 1;
    db.collection("friends")
      .doc(`${userEmail}`)
      .update({
        [str]: currSearch,
      });

    db.collection("followers")
      .doc(currSearch.email)
      .update({
        [str2]: self,
      });
  };
  const userEmail = fire.auth().currentUser.email;
  const classes = useStyles();
  const db = firebase.firestore();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const { profile, setProfile, userz, setUserz } = props;
  useEffect(() => {
    if (db) {
      const unsubscribe = db;
      db.collection("users")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setUsers(data);
        });
      db.collection("friends")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setFriends(doc.data());
          }
        });
      db.collection("users")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setSelf(doc.data());
          }
        });
      return unsubscribe;
    }
  }, [db]);
  return (
    <>
      <Toolbar title="Suggested" />
      <Grid>
        <Grid container direction="row">
          {users.map((key) => {
            return !Object.keys(friends).includes(
              key.email.slice(0, key.email.length - 4)
            ) && key.email !== fire.auth().currentUser.email ? (
              <>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  className={classes.root}
                >
                  <Grid container justify="flex-end"></Grid>
                  <div className={classes.photoContainer}>
                    <Link
                      to="userProfile"
                      onClick={() => {
                        setProfile(key.email);
                        setUserz(key);
                      }}
                    >
                      <Av data={key.email} />
                    </Link>
                  </div>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={5}
                  >
                    <Grid item xs={5.5}>
                      <Typography
                        variant="body2"
                        className={classes.channelUserName}
                      >
                        {key.firstname}
                      </Typography>
                    </Grid>
                  </Grid>
                  <div className={classes.chanelNameContainer}>
                    <Typography color="textSecondary" variant="caption">
                      {key.email}
                    </Typography>
                  </div>
                  {key.email !== userEmail &&
                  !Object.keys(friends).includes(
                    key.email.slice(0, key.email.length - 4)
                  ) ? (
                    <>
                      <Button
                        disableElevation
                        color="primary"
                        variant="contained"
                        size="small"
                        className={classes.followButton}
                        onClick={() => handleAddFriend(key)}
                      >
                        Follow
                      </Button>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      {key.email !== userEmail ? (
                        <>
                          {" "}
                          <Link to={"/FriendsStock"}>
                            <Button
                              disableElevation
                              color="primary"
                              variant="contained"
                              size="small"
                              className={classes.followButton}
                              onClick={() => setProfile(key.email)}
                            >
                              Watchlist
                            </Button>
                          </Link>{" "}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Grid>
              </>
            ) : null;
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default Suggested;
