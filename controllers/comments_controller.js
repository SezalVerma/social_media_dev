const Comment = require('../models/comment');
const Post = require('../models/post');

// const commentMailer = require('../mailer/comments_mailer');
const commentEmailWorker = require('../workers/comment-email-worker');
const queue = require('../config/kue');

module.exports.create =  async function (req, res) {

    try {
        let post = await Post.findById(req.body.post);
        // if post exist
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            // add comment id to --- posts comments array
            post.comments.push(comment._id);
            // save changes to db , after every update (without this changes are still in memory only )
            post.save();

             // Similar for comments to fetch the user's id!
            comment = await comment.populate('user', 'name email').execPopulate();

            // ------directly call mailer to send mail 
            //  commentMailer.newComment(comment);

            // ----- push job to queue that would handle all similar jobs onew by one
            // email -> queue title , created in commentEmailWorker 
            let job = queue.create('emails' , comment ).save( function(err){
                if(err){
                   console.log("Error in pushing a commentEmail job in queue" , err);
                   return;
                }
                //  as soon as job is created , its id is stored in job var
                console.log("Job enqueued" , job.id);

            });

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash("success", "Comment added");
        };
        return res.redirect('/home');
    } 
    catch (err) {
        req.flash("error", err);
        return res.redirect('/home');
    }
};

module.exports.delete = async function (req, res) {
    try{
        let comment = await Comment.findById(req.query.commentId);

        // if (comment.user == req.user.id || req.query.postUser == req.user.id) {
            let postId = comment.post;
            comment.remove();

            // remove  from comments array in post , a comment with some id
            await Post.findByIdAndUpdate(postId, {$pull: { comments: req.query.commentId }} );    
            req.flash("success", "Comment deleted");     
        // };

         // CHANGE :: destroy the associated likes for this comment
         await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }


        return res.redirect('back');
    }
    catch(err){
        req.flash("error",err);
        return res.redirect("back");
    }
};