const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Conversation = require('../models/Conversation')
const GlobalMessage = require('../models/GlobalMessage')
const Message = require('../models/Message')
const User = require('../models/User')
const auth = require('../middleware/auth')


// Route Handler to Post a global message

router.post('/group', auth, async (req, res) => {

    let message = new GlobalMessage({
        from: req.user._id,
        body:req.body.body
    })

    // Grab the io object reference
    const io = req.app.get('socketio')
    io.sockets.emit('messages',{message:req.body.body, id:req.user._id, name:req.user.name})

    try {
        await User.findOneAndUpdate({email: req.body.email}, {date: Date.now()})
        await message.save()
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message }));
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
    }

})

// Route Handler to Get Group Messages

router.get('/group', auth, async (req,res) => {

    try {
       const messages = await GlobalMessage.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField:'from',
                    foreignField:'_id',
                    as:'fromObj'
                }
            }
        ])
        res.send(messages);
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
    }
})

// Route Handler to Get conversations list
router.get('/conversations', auth, async (req, res) => {
    let from = mongoose.Types.ObjectId(req.user._id);
    // console.log(from)

    try {
        const conversations = await Conversation.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'recipients',
                    foreignField: '_id',
                    as: 'recipientObj',
                },
            },
        ])
            .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
            res.send(conversations);
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
    }

})

// Route Handler to GET private messages 
router.get('/conversations/query', auth, async (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.user._id);
    let user2 = mongoose.Types.ObjectId(req.query.userId);
    try {
        const messages = await Message.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ])
            .match({
                $or: [
                    { $and: [{ to: user1 }, { from: user2 }] },
                    { $and: [{ to: user2 }, { from: user1 }] },
                ],
            },
            
            {
                options: {
                    limit: parseInt(req.query.limit)
                }
            })
 
        res.send(messages);
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
    }

})


// Route Handler to GET Conversation from model for when user clicks a user in the users list. 
// This is ultimately so we can render the private conversations even when a user clicks on somebody from the user list on the front end. 

router.get('/conversation/query', auth, async (req, res) => {

    let from = mongoose.Types.ObjectId(req.user._id);
    let to = mongoose.Types.ObjectId(req.query.to);

    try {
        const response = await Conversation.findOne({
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from} },
                    { $elemMatch: { $eq: to } },
                ],
            },
        })
        res.send(response)
    } catch (err) {
        console.log(err)
    }

})


// Route Handler to POST a private message
router.post('/query',auth, async (req, res) => {
    let from = mongoose.Types.ObjectId(req.user._id);
    let to = mongoose.Types.ObjectId(req.body.to);
    const io = req.app.get('socketio')

    // If the message is longer than 24 characters, we will truncate the string inside of the conversations modal. 
    // This is so that an overly long message will not distort the conversations list in the UI. 
    let lastMessage = req.body.body
    if (req.body.body.length > 24) {
        const slicedMessage = req.body.body.slice(0,24)
        let lastIndex = slicedMessage.lastIndexOf(' ')
        lastMessage = `${req.body.body.slice(0,lastIndex)} . . . . . `
    }

    try {
        // When a User sends a message, we update their timestamp for the purpose of tracking activity. 
        await User.findOneAndUpdate({email: req.user.email}, {date: Date.now()})

        // Create a new Message from model
        let message = new Message({
            to: req.body.to,
            from: req.user._id,
            body: req.body.body,
        })


        // We will first check to see if the conversation exists. 
     let initialConvo = await Conversation.findOne({
        recipients: {
            $all: [
                { $elemMatch: { $eq: from } },
                { $elemMatch: { $eq: to } },
            ],
        },
    })


    // If the conversation does not exist, we will need tio create a conversation that has an unread Messages array that contains both of their respective ID's 

    // This is so we can keep track of unread messages and display its count on the UI. 

    // Otherwise, we will peform a similar operation without adding this new field. 

    if (initialConvo === null) {
        const conversation = await Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [req.user._id, req.body.to],
                lastMessage,
                date: Date.now(),
                unreadMessages: [
                    {userID: `${req.user._id}`},
                    {userID: `${req.body.to}`}
                ],

                $push: {messages: message}
            },
            { upsert: true, new: true, setDefaultsOnInsert: true })

            const updatedConversation = await Conversation.findOneAndUpdate({"_id": conversation._id, "unreadMessages.userID": req.body.to},  {$inc: { "unreadMessages.$.count": 1}})
            io.sockets.emit('messages', {message:req.body.body, id:req.user._id, name:req.user.name, recipientID:req.body.to, conversation: conversation._id})
            await message.save()
            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify({
                    message,
                    conversationId: conversation._id,
                })
            )     
    } else {
        const conversation = await Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [req.user._id, req.body.to],
                lastMessage,
                date: Date.now()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true })

            const updatedConversation = await Conversation.findOneAndUpdate({"_id": conversation._id, "unreadMessages.userID": req.body.to},  {$inc: { "unreadMessages.$.count": 1}})
            io.sockets.emit('messages', {message:req.body.body, id:req.user._id, name:req.user.name, recipientID:req.body.to, conversation: conversation._id})
            await message.save()
            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify({
                    message,
                    conversationId: conversation._id,
                })
            )     
        }
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
    }

})



// // Route Handler to Update Conversation by resetting count of unread messages to 0 for a specific user in a specific conversation. 

router.patch('/reset', auth, async (req, res) => {
    let userID = mongoose.Types.ObjectId(req.user._id);
    let conversationID = req.query.conversationID
    try {
        const conversation = await Conversation.findOneAndUpdate({"_id": conversationID,"unreadMessages.userID": req.user._id}, {$set: { "unreadMessages.$.count": 0}})
        res.send(conversation)
    } catch (err) {
        console.log(err);
    }
})


module.exports = router

