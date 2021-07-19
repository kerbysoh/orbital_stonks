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
    "&:hover": {
      cursor: "pointer",
    },
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
}));

const Friends = (props) => {
  const storage = firebase.storage();
  const [imageURL, setImageURL] = useState("");
  const classes = useStyles();
  const db = firebase.firestore();
  const userEmail = fire.auth().currentUser.email;
  const [search, setSearch] = useState("");
  const [currSearch, setCurrSearch] = useState({});
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const { userz, setUserz, handleLogout, profile, setProfile } = props;
  const [searchOn, setSearchOn] = useState(false);
  const [self, setSelf] = useState({});
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
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
      return unsubscribe;
    }
  }, [db]);

  const handleUnfollow = () => {
    var str = currSearch.email;
    str = str.slice(0, str.length - 4);
    var str2 = userEmail;
    str2 = str2.slice(0, str.length - 4);
    db.collection("users").doc(currSearch.email).update({
      followers: decrement,
    });
    db.collection("users").doc(`${userEmail}`).update({
      followed: decrement,
    });
    currSearch.followers -= 1;
    self.followed -= 1;
    db.collection("friends")
      .doc(`${userEmail}`)
      .update({
        [str]: firebase.firestore.FieldValue.delete(),
      });

    db.collection("followers")
      .doc(currSearch.email)
      .update({
        [str2]: firebase.firestore.FieldValue.delete(),
      });
    db.collection("followers")
      .doc()
      .get(currSearch.email)
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          db.collection("followers").doc(currSearch.email).set({});
        }
      });
    db.collection("friends")
      .doc()
      .get(`${userEmail}`)
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          db.collection("friends").doc(`${userEmail}`).set({});
        }
      });
  };

  const handleAddFriend = () => {
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
  const handleFriendSearch = () => {
    setSearchOn(false);
    var user = {};
    var user2 = {};
    var imageShow = false;
    for (const x of users) {
      if (x.email === search) {
        user = x;
        setSearchOn(true);
        imageShow = true;
      }
      if (x.email === userEmail) {
        user2 = x;
      }
    }
    if (imageShow) {
      var pathReference = storage.ref(`images/${user.email}`);
      pathReference.getDownloadURL().then((url) => {
        setImageURL(url);
      });
    }
    setCurrSearch(user);
    setSelf(user2);
  };
  return (
    <div>
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
          onClick={() => handleFriendSearch()}
          fontSize="large"
        />
        <br />
      </div>
      <Toolbar title="Friends" />
      {!searchOn ? (
        <ViewFriends
          userz={userz}
          setUserz={setUserz}
          profile={profile}
          setProfile={setProfile}
        ></ViewFriends>
      ) : null}

      {searchOn ? (
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.root}
        >
          <Grid container justify="flex-end">
            <Grid item xs={1}>
              <ClearIcon
                className={classes.header}
                onClick={() => setSearchOn(false)}
              />
            </Grid>
          </Grid>
          <div className={classes.photoContainer}>
            <Link to="userProfile" onClick={() => setProfile(currSearch.email)}>
              <Button onClick={() => setUserz(currSearch)}>
                <Avatar className={classes.avatar} src={imageURL}></Avatar>
              </Button>
            </Link>
          </div>
          <Grid container justify="center" alignItems="center" spacing={5}>
            <Grid item xs={5.5}>
              <Typography variant="body2" className={classes.channelUserName}>
                {currSearch.firstname}
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.chanelNameContainer}>
            <Typography color="textSecondary" variant="caption">
              {currSearch.email}
            </Typography>
          </div>

          {searchOn &&
          currSearch.email !== userEmail &&
          !Object.keys(friends).includes(
            currSearch.email.slice(0, currSearch.email.length - 4)
          ) ? (
            <>
              <Button
                disableElevation
                color="primary"
                variant="contained"
                size="small"
                className={classes.followButton}
                onClick={handleAddFriend}
              >
                Follow
              </Button>{" "}
            </>
          ) : (
            <>
              {" "}
              {currSearch.email !== userEmail ? (
                <>
                  {" "}
                  <Link to={"/FriendsStock"}>
                    <Button
                      disableElevation
                      color="primary"
                      variant="contained"
                      size="small"
                      className={classes.followButton}
                      onClick={() => setProfile(currSearch.email)}
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
      ) : null}

      <ViewSuggested
        profile={profile}
        setProfile={setProfile}
        userz={userz}
        setUserz={setUserz}
      />
    </div>
  );
};
export default Friends;
