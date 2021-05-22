import React from 'react'
import { Link }  from 'react-router-dom'
const Login = (props) => {
    const {email, setEmail, password, setPassword, passwordError, emailError, handleLogin, handleSignup, hasAccount, setHasAccount, confirmPassword, setConfirmPassword, clearErrors, clearInputs} = props
    return ( <section className = "login">
        <div className ="loginContainer">
            <keytitle> $TONK$ </keytitle>
            <label>Username</label>
            <input type = "text" autoFocus required value = {email} onChange = {(e) => setEmail(e.target.value)}/>
            <p className = "errorMsg">{emailError}</p>
            <label>Password</label> 
            <input type = "password" autoFocus required value = {password} onChange = {(e) => setPassword(e.target.value)}/>
            <p className = "errorMsg">{passwordError}</p>
            
            {!hasAccount ? (
                <>
                <label>Confirm Password</label> 
                <input type = "password" autoFocus required value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)}/>
                </> ) : <></>
            }
            <div className = "btnContainer">
                {hasAccount ? (
                    <>
                    <button onClick = {handleLogin}>Sign in</button>
                    <p>Don't have an account ? <span onClick = {() => {setHasAccount(!hasAccount); clearErrors(); clearInputs(); setConfirmPassword('')}} >Sign up</span> </p>
                    </>
                )
                    : (
                    <>
                    <button onClick = {handleSignup}>Sign up</button>
                    <p>Already have an account ? <span onClick = {() => {setHasAccount(!hasAccount); clearErrors(); clearInputs();setConfirmPassword('')}}>Sign in</span> </p>
                    </>

                    )
                }
            </div>
        
            <Link to = {"/Forget"}> Reset Password </Link>
        </div>
    </section> )
}
export default Login