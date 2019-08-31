const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function(req, res){
    try{
        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;//if user cliks on like then like counts will increase, if it was already liked by user then clicking the like will decrease the count

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes'); // if there are already existing likes in that post then populating them
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes'); // if there are already existing likes in that comment then populating them
        }

        //Check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id //since authenticated user can only like so using req.user._id
        })

        //if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(existingLike._id); // pulling from likes array in likeable
            likeable.save();

            existingLike.remove(); //removing from likes schema
            deleted = true;

        }else{
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id); // pusing in likes array of likeable
            likeable.save();
        }

        return res.json(200, {
            message: "Request successful",
            data:{
                deleted : deleted
            }
        })

    }catch(err){ //it is ajax response so returning response
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}