import React, { useState} from 'react';
import styles from './Home.module.css'
import Signup from '../../Components/Auth/Signup/Signup'
import Login from '../../Components/Auth/Login/Login'


const Home = (props) => {
    const [startPage, setStartPage] = useState('signup')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const nameChangeHandler = event => {
        let inputName = event.target.value
        setName(inputName)
    }

    const emailChangeHandler = event => {
        let inputEmail = event.target.value
        setEmail(inputEmail)
    }

    const passwordChangeHandler = event => {
        let inputPassword = event.target.value
        setPassword(inputPassword)
    }

    const toggleSignupAndLoginHandler = other => {
       startPage === 'signup' ? setStartPage('login') : setStartPage('signup')
    }

    let JSX

    if (startPage === 'signup') {
        JSX = <Signup
                {...props} 
                toggleSignupAndLoginHandler={toggleSignupAndLoginHandler}
                nameChangeHandler={nameChangeHandler}
                name={name}
                emailChangeHandler={emailChangeHandler}
                email={email} 
                passwordChangeHandler={passwordChangeHandler}
                password={password}
                setLoading={props.setLoading}
                titleCaseString={props.titleCaseString}/>
    } else {
        JSX = <Login 
                {...props} 
                toggleSignupAndLoginHandler={toggleSignupAndLoginHandler} 
                emailChangeHandler={emailChangeHandler}
                email={email} 
                passwordChangeHandler={passwordChangeHandler}
                password={password}/>
    }

    return (
        <div className={styles.Home}>
            {JSX}
        </div>
    )
}

export default Home