import React, {useState, useEffect} from 'react'
import socketIOClient from 'socket.io-client'
import styles from './Conversations.module.css'
import {GetConversationsHandler} from '../../../Services/ChatService'
import {AuthenticationService} from '../../../Services/AuthenticationService'
import GlobalImage from '../../../assets/global.png'


const Conversations = props => {
    const [conversations, setConversations] = useState([])
    const [newConversation, setNewConversation] = useState(null)
    const 
        {currentUser, 
        recentMessage, 
        setTotalCount, 
        setUser, 
        setScope, 
        setConversationID} = props
    const conversationsList = GetConversationsHandler()


    // Returns the recipient name that does not belong to the current user.
    const handleRecipient = recipients => {
        for (let i = 0; i < recipients.length; i++) {
            if (recipients[i].email !==AuthenticationService.currentUserValue.user.email) {
                return recipients[i];
            }
        }
        return null;
    };

    useEffect(() => {
        let mounted = true 
        async function fetchData() {
            try {
                let globalCount = 0
                let response = await conversationsList(currentUser[0].token)
                for (let i = 0 ; i < response.length; i++) 
                    {
                        response[i].name = handleRecipient(response[i].recipientObj).name
                         for (let j = 0 ; j < response[i].unreadMessages.length; j++) {

                            if (response[i].unreadMessages[j].userID !== currentUser[0].user._id) {
                                response[i].image = `
                               /users/${response[i].unreadMessages[j].userID }/avatar
                                `
                            }

                            if (response[i].unreadMessages[j].userID === currentUser[0].user._id) {
                                response[i].unreadCount = response[i].unreadMessages[j].count
                            }

                        }

                        if (response[i].unreadCount) globalCount += response[i].unreadCount
                    }
                setTotalCount(globalCount)
           
                if (mounted) setConversations(response) 
                    
            } catch (err) {
                console.log(err)
            }   
        }
        fetchData() 
        return () => mounted = false
    }, [currentUser, newConversation, recentMessage, conversationsList, setTotalCount])

    useEffect(() => {

        const URL = process.env.URL 
        const socket = socketIOClient();
        socket.on('messages', data => setNewConversation(data));
        return () => socket.removeListener('messages');
    }, [])

    return (
        <section>
            <div  
                className={styles.Conversation} 
                onClick={() => {
                    setUser('Global Chat')
                    setScope('Global Chat')         
                }}> 
                    <img 
                        alt="global" 
                        src={GlobalImage} 
                        className={styles.GlobalPic}/>
                    <p className={styles.Title}>Global Chat</p>
            </div>

            <div 
                className={styles.Conversations}>
                {conversations.map(conversation => {
                    return <div key={conversation._id} className={styles.Conversation} onClick={async () => {
                        setUser(handleRecipient(conversation.recipientObj))
                        setScope(handleRecipient(conversation.recipientObj).name)
                        setConversationID(conversation._id)
                    }}> 
                        <img 
                            alt="avatar" 
                            src={conversation.image} 
                            className={styles.ProfilePic} />
                        <span className={styles.ConversationData}>
                           <p className={styles.Title}>{conversation.name}</p>
                           <p className={styles.lastMessage}>{conversation.lastMessage} </p>
                        </span>
                         <p className={styles.Notification}>
                            {conversation.unreadCount > 0 
                            ? conversation.unreadCount 
                            : null}
                        </p>     
                    </div>
                })}
            </div>
        </section>
    )
}

export default Conversations