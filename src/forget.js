import React from 'react'
import { Link }  from 'react-router-dom'

const forget = (props) => {
    const {emailReset, setEmailReset, handleForget, emailResetError, setEmailResetError} = props
    return (
    <><h2>Forget Password</h2>
    <input type = "text" autoFocus required value = {emailReset} onChange = {(e) => setEmailReset(e.target.value)}/>
            <p className = "errorMsg">{emailResetError}</p>
    <button onClick = {handleForget}>Submit</button>
    <Link to = {'./'}>Sign in</Link>
    </>
    )
}
export default forget