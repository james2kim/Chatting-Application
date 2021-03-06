import { useSnackbar } from 'notistack'
import axios from 'axios'
import AuthHeader from '../Utilities/Auth-Header'


// Send a Group Message 

export const SendGroupMessageHandler = (limit) => {
    const { enqueueSnackbar } = useSnackbar()

    const sendGroupMessage = async (body,token) => {
        try {   
            const response = await axios({
                method:'POST',
                url:'/group',
                headers: AuthHeader(token),
                data: {
                    body
                }
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load Global Chat', {
                variant: 'error',
            })
        }
    }
    return sendGroupMessage
}

// Retrieve Group Messages 

export const GetGroupMessagesHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const getGroupMessages = async (token, limit) => {
        try {
            const response = await axios({
                method:'GET',
                url:`/group/query?limit=${limit}`,
                headers: AuthHeader(token)
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load Global Chat', {
                variant: 'error',
            })
        }
    }
    return getGroupMessages
}

// Retrieve All Users Conversations 

export const GetConversationsHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const getConversations = async token => {
        try {
            let response = await axios({
                method:'GET',
                url:'/conversations',
                headers: AuthHeader(token)
            })

            response = response.data.sort((a,b) => {
                return +b.date - +a.date
            })
            return response
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load chats', {
                variant: 'error',
            })
        }
    }
    return getConversations
}

// Retrieve a specific Users conversations

export const GetConversationHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const getConversation = async (token, id) => {
        try {
            const response = await axios({
                method:'GET',
                url: `/conversation/query?to=${id}&&limit=${50}`,
                headers:AuthHeader(token)
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load conversation', {
                variant: 'error',
            })
        }
    }
    return getConversation
}

// Post a private conversation 

export const SendPrivateMessageHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const sendPrivateMessage = async (id, body, token, userId) => {
        try {
            const response = await axios({
                method:'POST',
                url:`/query?userId=${userId}`,
                headers: AuthHeader(token),
                data: {
                    to:id,
                    body
                }
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could send message', {
                variant: 'error',
            });
        }
    }
    return sendPrivateMessage
}

//Get Messages in Private Conversation based on query parameter userId

export const GetPrivateMessagesHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const getPrivateMessages = async (id, token, limit) => {
        try {
            const response = await axios({
                method:'GET',
                url:`/conversations/query?userId=${id}&limit=${limit}`,
                headers: AuthHeader(token)
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load chats', {
                variant: 'error',
            })
        }
    }
    return getPrivateMessages
}


// Reset the count of unread messages after a chatroom is opened. 
export const ResetCountHandler = () => {
    const {enqueueSnackbar} = useSnackbar()

    const resetCount = async (token, conversationID) => {
        try {
            await axios({
                method:'PATCH',
                url:`/reset?conversationID=${conversationID}`,
                headers: AuthHeader(token)
            })
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not update', {
                variant: 'error',
            })
        }
    }
    return resetCount
}


