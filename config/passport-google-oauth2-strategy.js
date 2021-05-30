const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// used to generate unique random passwords for users signing through gmail
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    // options  -> vals in  project credentials in  ---> https://console.developer.google.com
    clientID : "641289074554-d7tsk29juf0n0bearjp958sdibovmmj8.apps.googleusercontent.com",
    clientSecret : "hrDkYWkiXtgNoMyVZ2zWy0aK",
    callbackURL : "http://localhost:8000/users/auth/google/callback"
}, 
/* accessToken -> token generated by google like jwt token
   refreshToken -> if accesstoken expires , a new token is created without user involved
   profile -> stores user info
*/
function(accessToken , refreshToken , profile , done){
    // a person can have more than 1 gmail , get val of first one
    User.findOne({email : profile.emails[0].value} , function(err,user){
        if(err){console.log("Err in passport-google-oauth",err); return;}

        console.log(profile);

        if(user){
            // user found , ssign in & et it as req.user
            return done(null , user);
        }else{
            User.create({
                name : profile.displayName,
                email : profile.emails[0].value,
                // rendom password generated in hexadecimal for each new user signup with gmail
                password : crypto.randomBytes(20).toString('hex')
            } , function(err,user){
                if(err){console.log("Err in creating user in passport-google-oauth",err); return;}
                return done(null , user);
            })
        }
    }) ;  
}));

module.exports = passport;