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
import UserAvatar from "./userAvatar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import DialogTitle from "@material-ui/core/DialogTitle";

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
   
    margin: "auto",
    color: "white",
    padding: "0 30px",
    border: "none",
    boxShadow: "none"
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
  const handleClose = () => {
    setDOpen(false);
  };
  const handleClose2 = () => {
    setOpen(false);
  };
  const [currDel, setCurrDel] = useState("");
  const [open, setOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  
  const handleViewComment = (post) => {
    if (currView === post) {
      setCurrView('')
      setReply("");
                          setReplyOn(false);
    } else {
      setCurrView(post);
      setReply("");
      setReplyOn(false);
    }
   

  }
  
  const [currReply, setCurrReply] = useState("");
  const [posts, setPosts] = useState([]);
 
  const [newPost, setNewPost] = useState("");
  const [errMsg, setErrmsg] = useState("");
  const [likes, setLikes] = useState({});
  const [replyOn, setReplyOn] = useState(false);
  const [currView, setCurrView] = useState("");
  const [reply, setReply] = useState("");
  
  const [comments, setComments] = useState([]);
 

  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
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
  const handleNewPost = () => {
    if (db) {
      db.collection("Posts")
        .add({
          text: newPost,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          email: fire.auth().currentUser.email,
          date: new Date().toString(),
          likes: 0,
        })
        .then(function (docRef) {
          db.collection("Likes").doc(docRef.id).set({});
        });
      db.collection("users").doc(fire.auth().currentUser.email).update({
        posts: increment,
      });
      setNewPost("");
    }
  };
  const handleReply = () => {
    if (db) {
      db.collection("Comments").add({
        text: reply,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        email: fire.auth().currentUser.email,
        date: new Date().toString(),
        postID: currReply,
        likes: 0,
      });
    }
    setReplyOn(false);
    setCurrView(currReply);
  };
  const handleDeletePost = (e) => {
    db.collection("Posts").doc(e).delete();
    db.collection("Likes").doc(e).delete();
    comments.map((comment) => {
      if (comment.postID === e) {
        db.collection("Comments").doc(comment.id).delete();
      }
    });
    db.collection("users").doc(fire.auth().currentUser.email).update({
      posts: decrement,
    });
    setReplyOn(false);
  };
  const handleLike = (x) => {
    const q = fire.auth().currentUser.email;
    const self = q.slice(0, q.length - 4);

    db.collection("Likes")
      .doc(x)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const keys = Object.keys(doc.data());
          if (!keys.includes(self)) {
            db.collection("Likes")
              .doc(x)
              .set({
                [self]: fire.auth().currentUser.email,
              });
            db.collection("Posts").doc(x).update({
              likes: increment,
            });
          } else {
            db.collection("Likes")
              .doc(x)
              .update({
                [self]: firebase.firestore.FieldValue.delete(),
              });
            db.collection("Posts").doc(x).update({
              likes: decrement,
            });
            db.collection("Likes")
              .doc()
              .get(x)
              .then((docSnapshot) => {
                if (!docSnapshot.exists) {
                  db.collection("Likes").doc(x).set({});
                }
              });
          }
        }
      });
    setReplyOn(false);
  };
  const handleOnChange = (e) => {
    setNewPost(e.target.value);
  };
  const handleDeleteComment = (e) => {
    db.collection("Comments").doc(e).delete();
  };
  const [opensnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("Copied Email to Clipboard");
  
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
        db.collection("Posts")
        .orderBy("createdAt")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setPosts(data.reverse());
        });
      
      db.collection("Likes")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setLikes(data);
        });
      db.collection("Comments")
        .orderBy("createdAt")
        .limit(10000)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setComments(data);
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
                        <Link to={"/FriendsStock"}>
                          <Button
                          variant="contained"
                          color="black"
                          className="postButton"
                          type="submit"
                          onClick={() => setProfile(currSearch.email)}
                        >
                          Watchlist
                        </Button>
                        </Link>
                        
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
      <div className = "profilePost">
      {posts.map((post) => {
            if (
              (Object.keys(friends).includes(
                post.email.slice(0, post.email.length - 4)
              ) ||
              post.email === fire.auth().currentUser.email) && (post.email === profile)
            ) {
              return (
                <>
                  <div class="post3">
                    <div class="header__left">
                      <div class="post__author">
                        <Link to="userProfile" className="userData">
                          <UserAvatar data={post.email} />
                        </Link>
                        <span class="author__name">
                          <h3>{handleData(post.email)}</h3>

                          <p>{post.date}</p>
                        </span>
                      </div>
                    </div>
                    <div className="content3"> {post.text} </div>
                    <div className="content2">{post.likes} likes</div>
                    <div className="post_option">
                      <FavoriteIcon
                        style={{ fontSize: 50 }}
                        className="post_options"
                        onClick={() => handleLike(post.id)}
                      />
                      {post.email === fire.auth().currentUser.email ? (
                        <>
                          <DeleteIcon
                            className="post_options"
                            style={{ fontSize: 50 }}
                            onClick={() => {
                              setDOpen(true);
                              setCurrDel(post.id);
                            }}
                          />
                        </>
                      ) : null}
                      <Dialog
                        open={dOpen}
                        onClose={() => handleClose()}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="Confirm Delete?">
                          {"Confirm Delete?"}
                        </DialogTitle>
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
                              handleDeletePost(currDel);
                              handleClose();
                            }}
                            color="primary"
                            autoFocus
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Button
                        className="post_options"
                        onClick={() => {
                          handleViewComment(post.id);
                         
                        }}
                      >
                        View Comments
                      </Button>
                      <Button
                        className="post_options"
                        onClick={() => {
                          setReplyOn(true);
                          setCurrReply(post.id);
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                    
                    {currView === post.id ? (
                      <>
                        <div className="comments">
                          {" "}
                          {comments.map((comment) => {
                            if (comment.postID === currView) {
                              return (
                                <>
                                  <UserAvatar data={comment.email} />
                                  <span class="author__name">
                                    <h3>{handleData(comment.email)}</h3>

                                    <p>{post.date}</p>
                                  </span>
                                  <div className="content3">{comment.text}</div>
                                  <div className="post_option">
                                    {comment.email ===
                                    fire.auth().currentUser.email ? (
                                      <>
                                        <DeleteIcon
                                          style={{ fontSize: 50 }}
                                          className="post_options"
                                          onClick={() => setOpen(true)}
                                        />
                                        <Dialog
                                          open={open}
                                          onClose={() => handleClose2()}
                                          aria-labelledby="alert-dialog-title"
                                          aria-describedby="alert-dialog-description"
                                        >
                                          <DialogTitle id="Confirm Delete?">
                                            {"Confirm Delete?"}
                                          </DialogTitle>
                                          <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                              Your action cannot be reversed
                                            </DialogContentText>
                                          </DialogContent>
                                          <DialogActions>
                                            <Button
                                              onClick={() => handleClose2()}
                                              color="primary"
                                            >
                                              No
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                handleDeleteComment(comment.id);
                                                handleClose2();
                                              }}
                                              color="primary"
                                              autoFocus
                                            >
                                              Yes
                                            </Button>
                                          </DialogActions>
                                        </Dialog>
                                      </>
                                    ) : null}{" "}
                                  </div>
                                </>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </>
                    ) : null}
                    {replyOn && post.id === currReply ? (
                      <>
                        <div className="postForm">
                          {" "}
                          <textarea
                            className="post"
                            placeholder="Type your comment here..."
                            onChange={(e) => setReply(e.target.value)}
                          ></textarea>{" "}
                          <Button
                            disabled={!reply}
                            variant="contained"
                            color="black"
                            className="postButton"
                            type="submit"
                            onClick={() => handleReply()}
                          >
                            Reply
                          </Button>{" "}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              );
            } else {
              return null;
            }
          })}
          </div>
    </>
  );
};

export default MyProfile;
