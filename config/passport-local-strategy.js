//  passport.js -> encrypt ur key while storing in cookies 

//  get passport middleware & strategy to use
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// ****** refer passport-local.js******

// passport.authenticate() uses this function & authenticate user by email & password
passport.use(new LocalStrategy({
    // usernameField -- unique field , setting usernameField to take email 
    usernameField: 'email',
    passReqToCallback : true
},
    function (req,email, password, done) {
        // find a user and establish the identity
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                req.flash("error", err);
                return done(err);
            }
            // ****done takes 2 args(err, any info to send/auth failed)

            if (!user || user.password != password) {
                req.flash("error" , "Invalid Username/Password ");
                // err- null & authentication- failed
                return done(null, false);
            }

            // if user found , return user to serialiseUser 
            return done(null, user);
        });

    }
));

// serialize which key to send to browser's cookies
// done -- callback function, can name it anything
passport.serializeUser(function (user, done) {
    // err->null & send user id in passport.session (created in index.js)
    done(null, user.id);
})

// get user from key(user id) in browser cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error while finding user -> passport-> deserialise");
            return done(err);
        }
        return done(null, user);
    })
})

// ************ functions defined by us on passport

// to see if user is already authenticated
passport.checkAuthentication = function (req, res, next) {
    // if user signed in, pass control to next function
    if (req.isAuthenticated()) {
        return next();
    }
    // if user not authenticated
    return res.redirect("/users/sign-in");
};

//  to set user from cookies
passport.setAuthenticatedUser = function (req, res, next) {
    // if user signed in 
    if (req.isAuthenticated()) {
        // req.user contains current user info from cookie session
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;