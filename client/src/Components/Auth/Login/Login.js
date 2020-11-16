import React from 'react'

import {LoginHandler} from '../../../Services/AuthenticationService'

import styles from './Login.module.css'



const Login = (props) => {
  const login = LoginHandler()
  const { email,
          passwordChangeHandler,
          emailChangeHandler,
          password,
          toggleSignupAndLoginHandler} = props

  const loginHandler = async event => {
    event.preventDefault()
    const user = await login(email, password)
    if (user) document.location.reload()
  }

  return (
      <div className={styles.Login}>
        <h1>Login to Chat App</h1>
        <form onSubmit={loginHandler}>
          <p><input 
                type="email" 
                placeholder="Email" 
                onFocus={(e) => e.target.placeholder = ""} 
                onBlur={(e) => e.target.placeholder = "Email"} 
                value={email} 
                onChange={emailChangeHandler}/></p>
          <p><input 
                type="password"
                placeholder="Password" 
                onFocus={(e) => e.target.placeholder = ""} 
                onBlur={(e) => e.target.placeholder = "Password"} 
                value={password}
                onChange={passwordChangeHandler}/></p>
          <p className="submit"><input type="submit" name="commit" value="Login" /></p>
        </form>
        <p className={styles.Other} onClick={toggleSignupAndLoginHandler}>No Account? Signup here.</p>
      </div>
  )
}

export default Login