const mongoose = require("mongoose");
const { use } = require("passport");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      // objectid -> type - particular object
      type: mongoose.Schema.Types.ObjectId,
      //  get objectid from "User" model - as stored in db
      ref: "User",
    },
    // add ids of all comments made on this post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
