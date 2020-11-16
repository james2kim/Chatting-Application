import React from 'react'

import styles from './Signup.module.css'
import {SignupHandler} from '../../../Services/AuthenticationService'

const Signup = (props) => {
    const signup = SignupHandler()
    const { name, 
            email, 
            password, 
            nameChangeHandler, 
            emailChangeHandler, 
            passwordChangeHandler, 
            toggleSignupAndLoginHandler, 
            titleCaseString} = props

    const signupHandler = async event => {
        event.preventDefault()
        const user = await signup(titleCaseString(name), email, password)
   
        if (user) window.location.reload()
    }

    return (
        <div className={styles.Signup}>
            <h1>Signup for Chat App</h1>
            <form onSubmit={signupHandler}>

              <p><input 
                    type="text" 
                    placeholder="Name" 
                    required
                    onFocus={(e) => e.target.placeholder = ""} 
                    onBlur={(e) => e.target.placeholder = "Name"} 
                    value={name} 
                    onChange={nameChangeHandler}/></p>

              <p><input 
                    type="email" 
                    placeholder="Email" 
                    required
                    onFocus={(e) => e.target.placeholder = ""} 
                    onBlur={(e) => e.target.placeholder = "Email"} 
                    value={email} 
                    onChange={emailChangeHandler}/></p>

              <p><input 
                    type="password" 
                    placeholder="Password" 
                    minLength="6"
                    required
                    onFocus={(e) => e.target.placeholder = ""} 
                    onBlur={(e) => e.target.placeholder = "Password"} 
                    value={password}
                    onChange={passwordChangeHandler}/></p>

              <p className="submit"><input type="submit" name="commit" value="Signup" /></p>
              
            </form>
            <p className={styles.Other} onClick={toggleSignupAndLoginHandler}>Already Signed Up? Login here.</p>
        </div>

    )
}

export default Signup