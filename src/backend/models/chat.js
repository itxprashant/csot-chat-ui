const mongoose = require('mongoose');

// create chat schema
const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    reciever: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        default: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    img_url: {
        type: String,
        default: ''
    }
});

// create chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat, chatSchema };
