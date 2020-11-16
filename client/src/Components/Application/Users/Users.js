import React, {useState, useEffect} from 'react'

import {GetUsersHandler} from '../../../Services/UserService'
import {GetConversationHandler} from '../../../Services/ChatService'
import socketIOClient from 'socket.io-client'
import styles from './Users.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Users = (props) => {
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState(null)
    const {currentUser, setUser, setScope, setConversationID} = props
    const userList = GetUsersHandler()
    const conversationHandler = GetConversationHandler()

    useEffect(() => {
        let mounted = true 
        async function fetchData() {
            let response = await userList(currentUser[0].token)

            for (let i = 0 ; i < response.length; i++) {
                response[i].image = `/users/${response[i]._id}/avatar`
            }

            if (mounted) setUsers(response) 
        }
    
        fetchData()
        return () => mounted = false
        // eslint-disable-next-line
    }, [newUser])

    const url = process.env.URL

    useEffect(() => {
        const socket = socketIOClient();
        socket.on('User', data => setNewUser(data));
    });

    const convertSecondsToMinutesOrHoursOrDays = (seconds) => {
        let roundedSeconds = Math.round(seconds)
        if (roundedSeconds >= 86400) {
            const days = Math.floor(roundedSeconds / 86400)
            return `${days}d`
        } else if (roundedSeconds >= 3600) {
            const hours = Math.floor(roundedSeconds / 3600)
            return `${hours}h`
        } else {
            const minutes = Math.floor(roundedSeconds / 60)
            return `${minutes}m`
        }
    }


    return (
        <section className={styles.Outline}>

            {users.map(user => {
                return <div key={user._id} className={styles.Users} onClick={ async () => {
                    setUser(user)
                    setScope(user.name)   
                    const conversation = await conversationHandler(currentUser[0].token, user._id)
                    setConversationID(conversation._id)
                }}> 

                    <img 
                        alt="avatar" 
                        className={styles.ProfilePic} 
                        src={user.image}/>

                    <span 
                        className={styles.UserDescription}>
                            <p className={styles.User}>{user.name}</p>
                        {((Date.now() - user.date)/1000) <= 300 ? 
                            <p className={styles.Active}>Active Now  <FontAwesomeIcon className={styles.Icon} icon={['fas', 'circle']} /></p> : 
                            <p className={styles.Active}>Active {convertSecondsToMinutesOrHoursOrDays((Date.now() - user.date) / 1000)} ago</p>}
                    </span>
                </div>
            })}

        </section>
    )
}

export default Users