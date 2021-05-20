import React from 'react'
import { Link }  from 'react-router-dom'

const forget = (props) => {
    const {emailReset, setEmailReset, handleForget, emailResetError} = props
    return (
        <section className = "login">
            <div className ="loginContainer">
                <><label>Forget Password</label>
                <input type = "text" autoFocus required value = {emailReset} onChange = {(e) => setEmailReset(e.target.value)}/>
                        <p className = "errorMsg">{emailResetError}</p>
                <button onClick = {handleForget}>Submit</button>
                <Link to = {'./'}>Sign in</Link>
                </>
            </div>
        </section>
    
    
    )
}
export default forget