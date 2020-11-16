const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now,
    },
    unreadMessages: [
        {userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, count: Number}, {userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}, count:Number}
    ],
    messages: {
        type:Array,
        default: []
    },

});

const Conversation = mongoose.model('conversations', ConversationSchema)

module.exports = Conversation