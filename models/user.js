const mongoose = require('mongoose');

// used for file uplaod , middleware
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    about : {
        type : String
    },
    security_ques : {
        type : String
    },
    security_ans : {
        type : String,
    },
    avatar : {
        type : String
    },
    follow: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Follow' 
        }
    ]

}, {
    // keep info of created at & modified at
    timestamps : true
})

// for disk/local storage of files -> check multer docs
let storage = multer.diskStorage({
    //  cb - callback func 
    destination: function (req, file, cb) {
        // path where to store files
      cb(null,   path.join( __dirname , '../assets' , AVATAR_PATH) );
    },
    filename: function (req, file, cb) {
        // file.fieldname -> avatar , in schema 
        // attaching date in millisec to avoid ambiguity when 2 files have same name
      cb(null, file.fieldname + '-' + Date.now())
    }
})
// statics - property defined
// signle - only one file per user for given field
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User' , userSchema);

module.exports = User;