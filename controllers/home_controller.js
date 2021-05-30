const User = require("../models/user");
const Post = require("../models/post");

//---------------- all actions for a route are enlisted in its controller

// module.exports.actionName = function(req,res){}

// -------------------cookies
// ---to see all cookies for the page in a browser
// console.log(req.cookies);
// ---to send or modify single cookie
// res.cookie('sezal' , '44');

module.exports.start = function(req,res){
  res.render('sign_up', {title : 'Sign Up'});
}

// async -> tells compiler that it contains async statements inside
module.exports.home = async function (req, res) {
  try {
    //  find all posts  , await -> first execute this & then move to next
    let posts = await Post.find({})
      // sort acc to time of creation , dec order
      .sort("-createdAt")
      // populate user of each post - means bring in whole object of user from id mentioned in posts
      // go to comments & populate user of each comment
      .populate("user likes")
      .populate({ path: "comments", populate: "user likes" });
    //////// path - enter array , populate - where objectid stored

    // send user friends
    let friends = await User.findById(req.user.id).populate({
      path: "follow",
      populate: {
        path: "to_user",
      },
    });

    let users = await User.find({});

    return res.render("home", {
      title: "Home",
      posts: posts,
      friends: friends,
      all_users: users,
    });
  } catch (err) {
    console.log("error while loading home page", err);
    return;
  }
};
