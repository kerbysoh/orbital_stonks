import './App.css';
import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route, BrowserRouter} from 'react-router-dom'
import fire from './fire'
import Login from './login'
import Hero from './Hero'
import Forget from './forget'
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [hasAccount, setHasAccount] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailReset, setEmailReset] = useState('')
  const [emailResetError, setEmailResetError] = useState('')
  const clearInputs = () => {
    setEmail('')
    setPassword('')
  }
  const clearErrors= () => {
    setEmailError('')
    setPasswordError('')
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
    clearErrors()
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
    }
    else
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
      }
    })
  }
  const handleLogout = () => {
    fire.auth().signOut();
  }
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
  useEffect(() => {
    authListener()
  }, [])
  

    
    return (
      
      <div className = "App">
      <Router>
      <Switch>
        
        
        <Route path = '/forget'>
          <Forget emailReset = {emailReset} setEmailReset = {setEmailReset} handleForget = {handleForget} emailResetError = {emailResetError} setEmailResetError = {setEmailResetError}/>
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
