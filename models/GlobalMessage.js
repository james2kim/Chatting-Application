const mongoose = require('mongoose')

const GlobalMessageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
})

const GlobalMessage = mongoose.model('GroupMessage', GlobalMessageSchema)

module.exports = GlobalMessage