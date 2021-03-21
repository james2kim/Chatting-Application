import React, {useState, useEffect} from 'react'
import socketIOClient from 'socket.io-client'
import styles from './Chatroom.module.css'
import {
    SendGroupMessageHandler,
    GetGroupMessagesHandler,
    SendPrivateMessageHandler,
    GetPrivateMessagesHandler,
    ResetCountHandler,
} from '../../../Services/ChatService'

import { useSnackbar } from 'notistack'
import GlobalImage from '../../../assets/global.png'

const Chatroom = props => {
    const { enqueueSnackbar } = useSnackbar()
    const [newMessage, setNewMessage] = useState('')
    const [limit, setLimit] = useState(20)
    const [audio] = useState(new Audio("https://www.soundjay.com/phone/sounds/phone-receiver-button-1.mp3"))
    const [divHeight, setDivHeight] = useState(document.querySelector('#messages'))
    // Asynchronous functions
    const getGroupMessages = GetGroupMessagesHandler()
    const sendGroupMessage = SendGroupMessageHandler()
    const getPrivateMessages = GetPrivateMessagesHandler()
    const sendPrivateMessage = SendPrivateMessageHandler()
    const resetCount = ResetCountHandler()
 
    const {   
        currentUser, 
        messages, 
        setMessages, 
        recentMessage, 
        setRecentMessage, 
        user,
        scope,
        conversationID,
        setConversationID } = props

    const scrollToBottom = () => {
        const objDiv = document.querySelector('#messages')
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    // Function to detect if user is at top of chatroom, if so, we will send the next set of paginated messages 

    const handleScroll = e => {
        const top = e.target.scrollTop
        if (top === 0) {
            setLimit(limit + 10)
            e.target.scrollTop = 5
        }
    }


    // Load Messages in chat box when new message is received or when the scope is changed
    useEffect(() => {
   
        async function fetchData() {
            const objDiv = document.querySelector('#messages')
            await loadMessages()
            if (limit === 20) scrollToBottom()
        }

        fetchData()

    }, [recentMessage, scope, conversationID, limit])





    // Socket Connection, alerts, and notifications for new messages 
    useEffect(() => {
            let mounted = true
            const URL = process.env.URL
            const socket = socketIOClient();
            socket.on('messages', data => {
            console.log('socket is working')
                if (mounted) setRecentMessage(data) 

                if (!data.recipientID && data.id !== currentUser[0].user._id) {
                    enqueueSnackbar(`New Global Message from ${data.name}`, {
                        variant: 'info'
                    })
                    audio.play()
                } else if (data.recipientID && data.recipientID === currentUser[0].user._id) {
                    enqueueSnackbar(`New Message from ${data.name}`, {
                        variant:'info'
                    })
                    audio.play()
                } 
    
            });
            return () => mounted = false

    // eslint-disable-next-line
    },[])

    // Adjust position of messages in chatbox

    useEffect(() => {
     scrollToBottom()
     setLimit(20)
    }, [scope])

    // Text Area Size Reformat
    useEffect(() => {

        if (window.innerWidth <= 800) 
            {
                if (newMessage.length <= 100) {
                    document.getElementById('textarea').style.height = '15px'
                } else if (newMessage.length <= 300) {
                    document.getElementById('textarea').style.height = '30px'
                } else if (newMessage.length <= 500) {
                    document.getElementById('textarea').style.height = '45px'
                }
            }
        else 
            {
                if (newMessage.length <= 100) {
                    document.getElementById('textarea').style.height = '30px'
                } else if (newMessage.length <= 300) {
                    document.getElementById('textarea').style.height = '60px'
                } else if (newMessage.length <= 500) {
                    document.getElementById('textarea').style.height = '90px'
                }
            }
  // eslint-disable-next-line
    }, [newMessage.length, window.innerWidth])

    // function to load messages 
    const loadMessages = async () => {
        try {
            if (props.scope === 'Global Chat') {
                const response = await getGroupMessages(currentUser[0].token, limit)

                setMessages(response.reverse())
            } else if (scope!== null && conversationID) {
                let response = await getPrivateMessages(user._id, currentUser[0].token, limit)
                await resetCount(currentUser[0].token, conversationID)
                setMessages(response.reverse())
                return response
            } else {
                setMessages([])
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Input change handler 
    const onChangeHandler = event => {
        let message = event.target.value
        setNewMessage(message)
    }

    // Submit handler for new message 
    const onSubmitHandler = async event => {
        event.preventDefault()
        if (newMessage === '') return
        try {
            if (scope === 'Global Chat') {
                await sendGroupMessage(newMessage, currentUser[0].token)
                setNewMessage('')
            } else {
                const response = await sendPrivateMessage(user._id, newMessage, currentUser[0].token)
                setConversationID(response.conversationId)
                setNewMessage('')
            }
        } catch (err) {
            alert('Unable to send message')
        }
    }

    // Message is sent upon pressing Enter 
    const handleUserKeyPress = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmitHandler(e) 
        }
    };


    return (
    <section className={styles.Chatroom}>

        <header className={styles.Header}>
            <span className={styles.ProfilePic}> 
                {props.scope === 'Global Chat' ? 
                    <img 
                        alt="globe"
                        src={GlobalImage} 
                        className={styles.GlobalPic}/> : 
                    <img 
                        alt="user-avatar"
                        src={`/users/${user._id}/avatar`} 
                        className={styles.ScopePic}/> }
            </span>
             <span className={styles.Description}>
                {props.scope}
            </span>
        </header>

        <div id="messages"  className={styles.Messages} onScroll={handleScroll}>
        {messages.map(message => {
            return <div key={message._id} className={styles.Message}>
                                <span className={styles.AvatarSpacing}>
                                    <img 
                                        alt="message-avatar" 
                                        className={styles.Avatar} 
                                        src={message.image} />
                                </span>
                                
                                <span className={styles.WordSpacing}>
                                   <p className={styles.Bold}>{message.fromObj[0].name}</p>
                                   <p className={styles.MessageBody}>{message.body}</p>
                                </span>
                   </div>
        })}
                 
        </div>
        <form onSubmit={onSubmitHandler}>
            <div className={styles.Send}>
                    <textarea  
                        placeholder="Begin Typing Here..."
                        onFocus={(e) => e.target.placeholder = ""} 
                        onBlur={(e) => e.target.placeholder = "Begin Typing Here..."} 
                        id="textarea"
                        className={styles.MessageInput}    
                        onKeyPress={(e) => handleUserKeyPress(e)}
                        value={newMessage} 
                        onChange={onChangeHandler} />
            </div>
        </form>
        
    </section>
    )
}

export default Chatroom