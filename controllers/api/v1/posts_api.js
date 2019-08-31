const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    //populte the user of each post
    let posts = await Post.find({}) //telling server to await
    .sort('-createdAt') //sorts the posts in reverse chronological order
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path:'user'
        }
    });

    return res.json(200, {     //sending back json response
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id); //find id from url string params
         // .id means converting the object id into string
        if (post.user == req.user.id){ // check whether post exists in database or not, post.user returns the user id
            post.remove();

            await Comment.deleteMany({post: req.params.id});


            return res.json(200, {
                message: "Post and associated comments deleted successfuly"
            });
        }else{ //if other than the user who created the post is trying to delete
            return res.json(401, {
                message: "You cannot delete this post"
            });
        }
    }catch(err){
        console.log('Error', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
    
