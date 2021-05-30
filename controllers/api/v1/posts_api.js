const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index =  async function(req,res){

    let posts = await Post.find({})
    // sort acc to time of creation , dec order
    .sort('-createdAt')
    // populate user of each post - means bring in whole object of user from id mentioned in posts
    .populate('user')
    // go to comments & populate user of each comment
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    });

    return res.json(200, {
        message : "List of Posts",
        posts : posts
    });
}

module.exports.delete =  async function(req,res){
    try{
        let post = await Post.findById( req.params.id );

        // req.user._id -> form of objectId , to compare ids , we need to convert them in strings .
        // mongoose does that automatically by providing req.user.id -> string
        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post : req.params.id}); 
               
            return res.json(200 , {message : "Post & its comments deleted successfully ..!!"});
        }
        else{
            return res.json(401 , {message : "You are not authorised to delete this post."});
        }
          

    }
    catch(err){
        
        return res.json(500 , {message : "Internal Server Error"})
    }    
};
