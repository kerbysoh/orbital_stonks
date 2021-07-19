import React, { useState, useEffect } from "react";
import "firebase/firestore";
import firebase from "firebase/app";
import fire from "../fire";
import Navbar from "../components/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MyProfileFollow from "./myProfileFollow.js";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  followButton: {
    textTransform: "none",
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),
    fontWeight: theme.typography.fontWeightMedium,
  },
  root: {
    maxWidth: 1500,
    margin: "auto",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(0, 105, 135, .3)",
    color: "white",
    padding: "0 30px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    color: "black",
  },
  center: {
    color: "black",
  },
  email: {
    color: "black",
  },
  pos: {
    textAlign: "center",
    marginBottom: 24,
    color: "black",
  },

  root2: {
    "& > *": {
      margin: theme.spacing(2),
      color: "black",
    },
    fontSize: 30,
  },
  center2: {
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
}));

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    justifyContent: "left",
    alignItems: "center",
  },
  sizeAvatar: {
    height: theme.spacing(30),
    width: theme.spacing(30),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const MyProfile = (props) => {
  const [self, setSelf] = useState({});
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const { userz, setUserz, handleLogout, profile, setProfile } = props;
  const db = firebase.firestore();
  const [currSearch, setCurrSearch] = useState(userz);
  const userEmail = fire.auth().currentUser.email;
  const [user, setUser] = useState([]);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const avatarclasses = useAvatarStyles();
  const [imageURL, setImageURL] = useState("");
  const [opensnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("Copied Email to Clipboard");
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
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

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    console.log(age_now);
    return age_now;
  };
  const handleCopy = (content) => {
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  useEffect(() => {
    if (db) {
      const unsubscribe = db;
      db.collection("users")
        .doc(profile)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUser(doc.data());
          }
          console.log(doc.data());
        });
      var storage = firebase.storage();
      var pathReference = storage.ref(`images/${profile}`);
      pathReference.getDownloadURL().then((url) => {
        setImageURL(url);
      });
      return unsubscribe;
    }
  }, [db]);
  return (
    <>
      <Navbar handleLogout={handleLogout} />

      <Card className={classes.root}>
        <CardContent>
          <div className={avatarclasses.root}>
            <Avatar className={avatarclasses.sizeAvatar} src={imageURL} />
            <div className={classes.root2}>
              <Typography
                className={classes.center2}
                variant="h3"
                component="h2"
              >
                {user.firstname} {user.lastname}{" "}
                {currSearch.email !== userEmail &&
                !Object.keys(friends).includes(
                  currSearch.email.slice(0, currSearch.email.length - 4)
                ) ? (
                  <>
                    <Button
                      variant="contained"
                      color="black"
                      className="postButton"
                      type="submit"
                      onClick={() => {
                        handleAddFriend();
                      }}
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
                        <Button
                          variant="contained"
                          color="black"
                          className="postButton"
                          type="submit"
                          onClick={() => handleUnfollow()}
                        >
                          Unfollow
                        </Button>{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </Typography>

              {<span className={classes.badge}> {user.posts} Posts</span>}
              {
                <span className={classes.badge}>
                  {" "}
                  {user.followers} Followers
                </span>
              }
              {
                <span className={classes.badge}>
                  {" "}
                  {user.followed} Following
                </span>
              }
              <span className={classes.Description}>{user.Description}</span>
            </div>
          </div>
          <div className="profileDiv">
            <Typography
              className={classes.center}
              variant="h6"
              color="textSecondary"
            >
              {user.gender}, {calculate_age(user.dob)}
            </Typography>
            <Typography
              className={classes.email}
              variant="h6"
              color="textSecondary"
            >
              <FileCopyIcon
                onClick={() => {
                  handleCopy(user.email);
                  handleClickSnack();
                }}
                className="atIcon"
                color="black"
              ></FileCopyIcon>{" "}
              {user.email}
            </Typography>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={opensnack}
              autoHideDuration={4000}
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MyProfile;
