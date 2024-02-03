let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConf: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('User', userSchema);