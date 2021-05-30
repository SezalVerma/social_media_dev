const passport = require("passport");
const githubStrategy = require("passport-github").Strategy;

const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new githubStrategy(
    {
      clientID: "592ca56193cdd554486a",
      clientSecret: "01cb76832e864652ac02573b5c9c55b604b516f6",
      callbackURL: "http://localhost:8000/users/auth/github/callback",
      // profileFields: ["email", "name"],
      // auth_type: "rerequest",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.profileUrl }).exec(function (err, user) {
        if (err) {
          console.log("error in oauth", err);
          return;
        }
        console.log(profile);
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.profileUrl,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log("error in creating user oauth", err);
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
