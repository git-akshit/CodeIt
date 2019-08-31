const Post = require('../models/post');
const User = require('../models/user');

//multiple actions form controller
//from here we can send data to views from db
//an action
// //before async await
// module.exports.home = function(req, res){ //exporting the home function
//     //console.log('user_id',25);
//     // Post.find({}, function(err, posts){//this query will return all posts in db
//     //     return res.render ('home', {//name of html ejs file
//     //         title: "CodeIt | Home",
//     //         posts: posts  //it sends these posts to views
//     //     });
//     // });
//    //populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({ //populating comments and user who commented it
//         path: 'comments',
//         populate: {
//             path:'user'
//         }
//     })
//     .exec(function(err,posts){ //populate('user') will populate the user and since we are using populate so we need use exec for callback function
//         User.find({}, function(err, users){
//             return res.render ('home', {//name of html ejs file
//                 title: "CodeIt | Home",
//                 posts: posts, //it sends these posts to views
//                 all_users: users //sending all users to view
//             });
//         });
        
//     })
// }

module.exports.home = async function(req, res){ 

  try{
    //populte the user of each post
    let posts = await Post.find({}) //telling server to await
    .sort('-createdAt') //sorts the posts in reverse chronological order
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'likes'
        },populate: {
            path: 'user'
        }
    }).populate('likes');

    let users = await User.find({})
    .populate('friendships');
    

    return res.render ('home', {
        title: "CodeIt | Home",
        posts: posts, 
        all_users: users 
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
}


// module.exports.actionName = function(req, res){}

//using then 
//Post.find({}).populate('commments').then(function());

//let posts = Post.find({}).populate('comments').exec();

//posts.then() //exeecuting the above code,this is how promises work