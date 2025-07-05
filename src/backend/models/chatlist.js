const mongoose = require('mongoose');

// create chatlist schema
const chatListSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    contacts: [{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/ // simple email validation
        },
        lastMessage: {
            type: String,
            default: ''
        },
        lastMessageTime: {
            type: String,
            default: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        unreadMessages: {
            type: Number,
            default: 0
        }
    }]
});

// create chatlist model
const ChatList = mongoose.model('ChatList', chatListSchema);

module.exports = { ChatList, chatListSchema };