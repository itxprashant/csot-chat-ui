const mongoose = require('mongoose');

// schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // simple email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // minimum password length
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'offline' // default status
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };