import React, {useState} from 'react'
import styles from './Chat.module.css'
import Navbar from '../../Components/Application/Navbar/Navbar'
import {AuthenticationService} from '../../Services/AuthenticationService'
import Users from '../../Components/Application/Users/Users'
import Conversations from '../../Components/Application/Conversations/Conversations'
import Chatroom from '../../Components/Application/Chatroom/Chatroom'


const Chat = props => {

    const currentUser = useState(AuthenticationService.currentUserValue);
    const [active, setActive] = useState(true)
    const [scope, setScope] = useState('Global Chat')
    const [user, setUser] = useState(null)
    const [totalCount, setTotalCount] = useState(0)
    const[conversationID, setConversationID] = useState('')
    const [messages, setMessages] = useState([])
    const [recentMessage, setRecentMessage] = useState(null)
    const {setCurrentUser} = props

    const toggleActiveHandler = () => {
        const toggle = !active
        setActive(toggle)

    }

    let JSX = <Conversations currentUser={currentUser} setUser={setUser} setScope={setScope}/>

    if (active) {
        JSX = <Conversations 
                currentUser={currentUser} 
                user={user}
                setUser={setUser} 
                setScope={setScope}
                conversationID={conversationID}
                setConversationID={setConversationID}
                recentMessage={recentMessage}
                setTotalCount={setTotalCount}/>
    } else {
        JSX = <Users  
                currentUser={currentUser} 
                setUser={setUser} 
                setScope={setScope} 
                setConversationID={setConversationID} />
    }


    return (
        <main>
            <Navbar 
                {...props} 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser} 
                totalCount={totalCount}/>
            <section className={styles.Layout}>
                <section>
                    <div className={styles.Tabs}>
                        <div 
                            onClick={toggleActiveHandler} 
                            className={active ? 
                                styles.Active 
                                : styles.NonActive}>
                                <span>Chats {totalCount > 0 ? 
                                                <span className={styles.Unread}>{totalCount}</span> 
                                                : null}
                                </span>  
                                <hr 
                                    className={active ? 
                                                styles.ActiveLine 
                                                : styles.NonActiveLine}/>
                        </div>

                        <div 
                            onClick={toggleActiveHandler} 
                            className={!active ? 
                                        styles.Active 
                                        : styles.NonActive}>
                            <span>Users</span>  
                            <hr 
                                className={active ? 
                                            styles.NonActiveLine 
                                            : styles.ActiveLine}/>
                        </div>
                    </div>
                    <div className={styles.Left}>
                        {JSX}  
                    </div>
                </section>
                
                <Chatroom 
                    scope={scope}
                    currentUser={currentUser}
                    conversationID={conversationID}
                    setConversationID={setConversationID}
                    messages={messages}
                    setMessages={setMessages}
                    recentMessage={recentMessage}
                    setRecentMessage={setRecentMessage}
                    setActive={setActive}
                    user={user} />
            </section>
        </main>
    )

}

export default Chat 