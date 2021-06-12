import React from 'react'
import { Link }  from 'react-router-dom'
const Login = (props) => {
    
    
    const {email, setEmail, password, setPassword, passwordError, emailError, handleLogin, handleSignup, hasAccount, setHasAccount, confirmPassword, setConfirmPassword, clearErrors, clearInputs, description, setDescription, firstName, setFirstName, lastName, setLastName, setGender, dob, setDob, genderError, firstNameError, lastNameError, descriptionError, dobError, image, setImage, imageError} = props
    const handleChangeProfile = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    return ( <section className = "login">
        <div className ="loginContainer">
            <h1> $TONK$ </h1>
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
                <label>First Name</label> 
                <input type = "firstName" autoFocus required value = {firstName} onChange = {(e) => setFirstName(e.target.value)}/>
                <p className = "errorMsg">{firstNameError}</p>
                <label>Last Name</label> 
                <input type = "lastName" autoFocus required value = {lastName} onChange = {(e) => setLastName(e.target.value)}/>
                <p className = "errorMsg">{lastNameError}</p>
                <label>Gender</label> 
                <button onClick = {() => setGender("Male")}>Male</button>
                <button onClick = {() => setGender("Female")}>Female</button>
                <button onClick = {() => setGender("Others")}>Others</button>
                <p className = "errorMsg">{genderError}</p>
                <label>A short description of yourself</label> 
                <input type = "description" autoFocus required value = {description} onChange = {(e) => setDescription(e.target.value)}/>
                <p className = "errorMsg">{descriptionError}</p>
                <label>Date of Birth</label> 
                <input type = "dob" autoFocus required value = {dob} placeholder = "YYYY-MM-DD" onChange = {(e) => setDob(e.target.value)}/>
                <p className = "errorMsg">{dobError}</p>
                <label>Upload profile picture</label>
                <input type = "file" onChange = {handleChangeProfile} />
                <p className = 'errorMsg'>{imageError}</p>

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