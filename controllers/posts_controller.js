// all actions for posts view

const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
  try {
    console.log(req.user);
    let post = await Post.create({
      content: req.body.content,
      title: req.body.title,
      user: req.user._id,
    });

    // if ajax request , xhr-> XML Http Request
    if (req.xhr) {
      req.flash("success", "Post published");
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created!",
      });
    }
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.delete = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    // req.user._id -> form of objectId , to compare ids , we need to convert them in strings .
    // mongoose does that automatically by providing req.user.id -> string
    if (post.user == req.user.id) {
      // CHANGE :: delete the associated likes for the post and all its comments' likes too
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });

      post.remove();

      await Comment.deleteMany({ post: req.params.id });
      req.flash("success", "Post deleted");
      // console.log("################## req.xhr",req.xhr);
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }
    } else {
      req.flash("error", "U cant delete this post");
    }
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
