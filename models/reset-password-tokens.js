const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    accessToken : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    isValid : {
        type : Boolean
    }
}, {timestamps : true});


const ResetPasswordTokens = mongoose.model('ResetPasswordTokens' , tokenSchema );

module.exports = ResetPasswordTokens;