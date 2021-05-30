const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
// module used to extract jwt token from headers of req
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');


/*  passport-jwt - 3 args -->  hedares.payload.signature
    1. headers - include token encrypted
    2. payload - include info of user stored in token
    3. signature - secret key for decrypt
 */

var opts = {
    // get jwt --->     headers - auth - bearerToken(jwt token)
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    // encryption/decryption key
    secretOrKey : 'codeial'
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done) {

    User.findById( jwtPayload._id, function(err, user) {
        if (err) {
            console.log("Err in finding user in jwt");
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;