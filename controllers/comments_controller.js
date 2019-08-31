const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

// //we will add comment if a post exists thats why we use below check to see if posts exists as anybody can use developer tools to change hidden value of posts in comments
// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){

//         if (post){ //if post is present in db
//             Comment.create({  // creating the comment in db
//                 content: req.body.content,
//                 post: req.body.post,  
//                 user: req.user._id
//             }, function(err, comment){
//                 //handle error
//                 if(err){console.log('error in creating a comment'); return;}

//                 post.comments.push(comment); //it will find the id of comment and update it in array of comments in post
//                 post.save();//to reflect the changes in db
                
//                 res.redirect('/');
//             });
//         }
//     });
// }

// module.exports.destroy = function(req, res){
//     Comment.findById(req.params.id, function(err, comment){
//         if (comment.user == req.user.id){
//             let postId = comment.post; //finding the save the post id before deleting the comment as this post id will be used to remove comment from comments array in posts db
            
//             comment.remove();

//             Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post){//pull the delete comment from comments array in post
//                 return res.redirect('back');
//             })
//         } else {
//             return res.redirect('back');
//         }
//     });
// }

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            //placed comment here as we need user to be populated and has comment
            comment = await comment.populate('user', 'name email').populate({path: 'user'}).execPopulate();
            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){ //a new job is being created in the queue.If there is no queue then it creates a queue, it is automatically handled when it is created and saved in db, job id is available to us
                //emails should be same as in comment_email_worker function queue.process, because worker is pinging in the emails queue
                if (err){
                    console.log('Error in creating a queue');
                    return;
                }

                console.log('job enqueued', job.id);
            });


            if (req.xhr){
                // Similar for comments to fetch the user's id!
                //comment = await comment.populate('user', 'name').execPopulate();
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash('success','Comment posted');
            res.redirect('/');
        }
    }catch(err){
        //console.log('Error', err);
        req.flash('error',err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            
             // send the comment id which was deleted back to the views
             if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success','Comment deleted');
            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        //console.log('Error', err);
        req.flash('error', err);
        return;
    }
    
}