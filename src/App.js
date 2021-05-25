import './App.css';
import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import fire from './fire'
import Login from './LoginComponents/login'
import Hero from './Hero'
import Forget from "./LoginComponents/forget";
import Trade from './TradeComponents/Trade'
import News from './NewsComponents/News'
import ViewFriends from './ChatComponents/viewFriends'
import Friends from './ChatComponents/friends'
import firebase from 'firebase/app'
import Chat from './ChatComponents/chat'
import 'firebase/firestore'
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [genderError, setGenderError] = useState('')
  const [dobError, setDobError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [dob, setDob] = useState('')
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [hasAccount, setHasAccount] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailReset, setEmailReset] = useState('')
  const [emailResetError, setEmailResetError] = useState('')
  const db = firebase.firestore()
  const clearInputs = () => {
    setEmail('')
    setDob('')
    setDescription('')
    setGender('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setConfirmPassword('')
    setEmailReset('')
  }
  const clearErrors= () => {
    setEmailError('')
    setPasswordError('')
    setDescriptionError('')
    setGenderError('')
    setFirstNameError('')
    setLastNameError('')
    setDobError('')
    setEmailResetError('')
  }
  const handleLogin = () => {
    clearErrors()
    fire
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch((err) => {
      switch(err.code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setEmailError(err.message)
          break
        case "auth/wrong-password":
          setPasswordError(err.message)
          break
        default:
          break
      }
    })
  }
  const handleForget = () => {
    setEmailResetError('')
    fire
    .auth()
    .sendPasswordResetEmail(emailReset).then(function(){
      setEmailResetError('Email has been sent to you, Please Check')
    })
    .catch(function(error) {
      setEmailResetError(error.message)
    }
    )
  }
  const handleSignup = () => {
    var newDate = new Date(`${dob}T00:00:00`)
    clearErrors()
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
    }
    if (newDate.getTime() !== newDate.getTime()) {
      setDobError('Date is not valid')
    }
    if (gender === '') {
      setGenderError('Gender is not indicated. Please click on either of the 3 buttons')
    }
    if (firstName === '') {
      setFirstNameError('Please key in your first name')
    }
    if (lastName === '') {
      setLastNameError('Please key in your last name')
    }
    if (description === '') {
      setDescriptionError('Please key in a short description about yourself')
    }
    else {
    fire
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((err) => {
      switch(err.code) {
        case "auth/invalid-email":
        case "auth/email-already-in-use":
          setEmailError(err.message)
          break
        case "auth/weak-password":
          setPasswordError(err.message)
          break
        default:
          break
      }
    })
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        if (db) {
          db.collection('users').doc(`${email}`).set({
          email: email,
          Description: description,
          firstname : firstName,
          lastname: lastName,
          gender: gender,
          dob: new firebase.firestore.Timestamp.fromDate(newDate)
        })
        db.collection('friends').doc(`${email}`).set({})
        db.collection('Stocks').doc(`${email}`).set({})
    }
      }
    })
  }

  }
  const handleLogout = () => {
    fire.auth().signOut();
  }
  useEffect(() => {
    const authListener = () => {
      fire.auth().onAuthStateChanged(user => {
        if (user) {
          clearInputs()
          clearErrors()
          setUser(user)
  
        } else {
          setUser('')
        }
      })
    }
    authListener()
  }, [])
    
    return (
      
      <div className = "App">
      <Router>
      <Switch>
      <Route path = '/Chat'>
          {user ? (<Chat user = {user} db = {db}/>) : (<Link to = {'/Login'}>Log in</Link> )}
      </Route>
        <Route path = '/Forget'>
          <Forget emailReset = {emailReset} setEmailReset = {setEmailReset} handleForget = {handleForget} emailResetError = {emailResetError} setEmailResetError = {setEmailResetError}/>
        </Route>

        <Route path = '/News'>
          {user ? <News /> : <Link to = {'/'}>Log in</Link>}
        </Route>
        <Route path = '/Friends'>
          {user ? <Friends  /> : <Link to = {'/'}>Log in</Link>}
        </Route>
        <Route path = '/viewFriends'>
          {user ? <ViewFriends  /> : <Link to = {'/'}>Log in</Link>}
        </Route>
        <Route path = '/Trade'>
          {user ? <Trade /> : <Link to = {'/'}>Log in</Link>}
        </Route>

        <Route path = '/'>
        {user ? (
          <Hero handleLogout = {handleLogout}/>)
          : (
            <Login email = {email} 
        setEmail  = {setEmail}
        password = {password} 
        setPassword = {setPassword}
        passwordError = {passwordError} 
        emailError = {emailError}
        handleLogin = {handleLogin}
        handleLogout = {handleLogout}
        handleSignup = {handleSignup} 
        hasAccount = {hasAccount}
        setHasAccount = {setHasAccount}
        confirmPassword = {confirmPassword}
        setConfirmPassword = {setConfirmPassword}
        clearErrors = {clearErrors}
        clearInputs = {clearInputs}
        description = {description}
        setDescription = {setDescription}
        gender = {gender}
        setGender = {setGender}
        firstName = {firstName}
        setFirstName = {setFirstName}
        lastName = {lastName}
        setLastName = {setLastName}
        dob = {dob}
        setDob = {setDob}
        firstNameError = {firstNameError}
        setFirstNameError = {setFirstNameError}
        lastNameError = {lastNameError}
        setLastNameError = {setLastNameError}
        dobError = {dobError}
        setDobError = {setDobError}
        descriptionError = {descriptionError}
        setDescriptionError = {setDescriptionError}
        genderError = {genderError}
        setGenderError = {setGenderError}
        />
          )

        }
        </Route>
      </Switch>
      </Router>
      </div>
    )


  }



export default App;
