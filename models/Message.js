const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
    image: {
        type:String
    }
});

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message