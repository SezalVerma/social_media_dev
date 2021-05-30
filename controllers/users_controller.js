// const { user } = require('../config/mongoose');
const User = require("../models/user");
const ResetPasswordTokens = require("../models/reset-password-tokens");
const Follow = require("../models/follow");
const fs = require("fs");
const path = require("path");
const { dirname } = require("path");
const crypto = require("crypto");
const Post = require("../models/post");

// ---------------------------------------------all actions for users model

module.exports.profile = async function (req, res) {
  try {
    // find in data of user logged in
    let logged_user = await User.findById(req.user.id).populate(
      "follow",
      null,
      { to_user: { $in: [req.params.id] } }
    );

    let bool;
    if (logged_user.follow[0] && logged_user.follow[0].to_user == req.params.id)
      bool = true;
    else bool = false;

    console.log(logged_user);
    // console.log(bool);
    // console.log(bool);

    console.log(bool);

    let user = await User.findById(req.params.id);

    const count_following = await Follow.find({from_user : req.user._id}).count();
        console.log(count_following);
   
    const count_followers = await Follow.find({to_user : req.user._id}).count();
        console.log(count_followers);

    let posts =  await Post.find({user : user._id})
    .populate('user likes').populate({path : 'comments', populate: 'user likes'});
    const count_posts = await Post.countDocuments(posts);

    return res.render("profile", {
      title: "User Profile",
      user_profile: user,
      posts: posts,
      follow: bool,
      count_posts : count_posts,
      count_followers : count_followers,
      count_following : count_following
    });
  } catch (err) {
    console.log("err-", err);
    return;
  }
};

module.exports.follow = async function (req, res) {
  try {
    let follow_obj = await Follow.create({
      from_user: req.user._id,
      to_user: req.query.to,
    });

    let user = await User.findById(req.user.id);

    user.follow.push(follow_obj._id);

    user.save();

    res.redirect("back");
  } catch (err) {
    console.log("err", err);
    return;
  }
};

module.exports.unfollow = async function (req, res) {
  try {
    let follow_obj = await Follow.findOne({
      from_user: req.user._id,
      to_user: req.query.to,
    });
    console.log(follow_obj);
    let follow_id = follow_obj.id;
    // let follow_obj = await Follow.findById(req.query.follow_id);

    // console.log(follow_obj);
    await User.findByIdAndUpdate(req.user.id, { $pull: { follow: follow_id } });

    follow_obj.remove();

    // User.follow.pull(req.query.follow_id);

    // User.save();

    res.redirect("back");
  } catch (err) {
    console.log("err", err);
    return;
  }
};

module.exports.profile_update = async function (req, res) {
  // if( req.user.id== req.params.id && req.user.password == req.body.password){
  //     User.findByIdAndUpdate(req.user.id , req.body , function(err,user){
  //         if(user){
  //             req.flash("success", "Profile Updated");
  //         }
  //         return res.redirect('back');
  //     })
  // }
  // console.log(req.user.password);
  // console.log(req.body.about);
  // console.log(req.user.name);
  // console.log(req.body.password);

  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.user._id);
      if (user) {
        // form with files , body parser cant parse file path , so use this
        User.uploadedAvatar(req, res, function () {
          user.name = req.body.name;
          user.about = req.body.about;
          if (req.file) {
            // if profile pic already exists , remove its file from uploads/avatars
            if (user.avatar)
              fs.unlinkSync(path.join(__dirname, "../assets", user.avatar));

            //  store path of uploaded file in avatar field of user
            user.avatar = User.avatarPath + "/" + req.file.filename;
          }

          user.save();
          res.redirect("back");
        });
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "You can't update this");
    // status -> takes to another empty page
    // res.status(401).send('Unauthorized');
    return res.redirect("back");
  }
};

//  get sign In page
module.exports.sign_in = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign_in", { title: "Sign In" });
};

// get sign Up page
module.exports.sign_up = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign_up", { title: "Sign Up" });
};

module.exports.sign_out = function (req, res) {
  // this flash is passed to res in middleware & displayed on page redirected to
  req.flash("success", "Logged out");
  // function in passport, session is being destroyed here
  req.logout();
  return res.render("sign_in", { title: "Sign In" });
};

module.exports.forgot_password = function (req, res) {
  return res.render("forgot-password", { title: "Forgot Password" });
};
module.exports.to_security_check = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Err in finding user ", err);
      return;
    }

    if (user) {
      return res.render("security_check", {
        title: "Security Check",
        ques: user.security_ques,
        email: user.email,
      });
      // res.render('reset-password', {accessToken : token , title : "Reset Password"});
      // })
    }

    if (!user) {
      req.flash("error", "User doesnt exist");
      res.redirect("back");
    }
  });
};

module.exports.to_reset_password = function (req, res) {
  User.findOne({ email: req.params.email }, function (err, user) {
    if (err) {
      console.log("Err in finding user in reset-password", err);
      return;
    }

    if (req.body.security_ans == user.security_ans) {
      let token = crypto.randomBytes(20).toString("hex");

      console.log(token);

      ResetPasswordTokens.findOne({ user: user._id }, function (err, data) {
        if (err) {
          console.log("err in finding user in tokenschema ", err);
          return;
        }

        if (data) {
          ResetPasswordTokens.findByIdAndUpdate(
            data._id,
            {
              accessToken: token,
              isValid: true,
            },
            function (err, token_data) {
              if (err) {
                console.log("err in creating token ", err);
                return;
              }
            }
          );
        }
        if (!data) {
          ResetPasswordTokens.create(
            {
              accessToken: token,
              user: user._id,
              isValid: true,
            },
            function (err, token_data) {
              if (err) {
                console.log("err in creating token ", err);
                return;
              }
              console.log(token_data);
            }
          );
        }
        console.log(data);
        res.render("reset-password", {
          accessToken: token,
          title: "Reset Password",
        });
      });
    } else {
      req.flash("error", "Wrong Info ");
      res.render("sign_in", { title: "Sign In" });
    }
  });
};

module.exports.reset_password = function (req, res) {
  if (req.body.password == req.body.confirm_password) {
    console.log(req.body.password + "Hello");

    ResetPasswordTokens.findOne(
      { accessToken: req.params.token },
      function (err, data) {
        console.log(data + "Hellooooooooooo");

        if (err) {
          console.log("err in finding token", err);
          return;
        }
        // if()
        if (data.isValid) {
          User.findByIdAndUpdate(
            data.user,
            { password: req.body.password },
            function (err) {
              if (err) {
                console.log("err in updating password", err);
                return;
              }
            }
          );
          data.isValid = false;
          req.flash("success", "Password changed successfully!!");
          res.redirect("/users/sign-in");
        } else {
          res.redirect("back");
        }
      }
    );
  } else {
    req.flash("error", "passwords doesnt match");
    res.redirect("back");
  }
};

// create new user
module.exports.create_user = function (req, res) {
  //  if both passwords doesn't match
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords doesn't match ");
    return res.redirect("back");
  }

  // check if user already exist
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("error", err);
      return;
    }

    // if user  exist
    if (user) {
      req.flash("error", "User already exists ");
      return res.redirect("/users/sign-in");
    }
    // if not , create new
    else {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error", err);
          return;
        }
        req.flash("success", "Profile created");
        return res.redirect("/users/sign-in");
      });
    }
  });
};

// create new session when user sign in
module.exports.create_session = function (req, res) {
  req.flash("success", "Logged In successfully !!");
  // after authentication by passport in route , redirects to home page
  return res.redirect("/home");
};
