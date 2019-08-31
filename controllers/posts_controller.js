const Post = require('../models/post')
//we need controller which takes the data from form and loads it in db from routes
const Comment = require('../models/comment');
const Like = require('../models/like');


//before async await
// module.exports.create = function(req,res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if(err){console.log('error in creating a post'); return;}

//         return res.redirect('back');
//     });
// }

//with async await
module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
    });
    
    if (req.xhr){ //checking if the req is ajax req as type of req is xml http request which is xhr
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        post = await post.populate('user', 'name').populate({path: 'user'}).execPopulate();

        return res.status(200).json({ // we return json with status, status is successful as post is created
            data: { // json will contain key data
                post: post
            },
            message: "Post Created" // general format of interacting when you are sending the data back by json is including a message
        });
    }

    req.flash('success','Post published');
    return res.redirect('back');

    }catch(err){
        req.flash('error',err);
        //So that we can see it log as well
        console.log('Error', err);
        return res.redirect('back');
    }
}


// module.exports.destroy = function(req,res){
//     Post.findById(req.params.id, function(err, post){ //find id from url string params
//         // .id means converting the object id into string
//         if (post.user == req.user.id){ // check whether post exists in database or not, post.user returns the user id
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });
//         }else{ //if other than the user who created the post is trying to delete
//             return res.redirect('back');
//         }
//     });
// }


module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id); //find id from url string params
         // .id means converting the object id into string
         if (post.user == req.user.id){ // check whether post exists in database or not, post.user returns the user id
            
            // delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id : req.params.id
                    },
                    message: 'Post deleted'
                });
            }
            
            req.flash('success','Post and associated comments deleted');

            return res.redirect('back');
        }else{ //if other than the user who created the post is trying to delete
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    }catch(err){
        //console.log('Error', arr);
        req.flash('error', err);
        return res.redirect('back');
    }
}
    
