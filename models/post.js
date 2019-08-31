const mongoose = require('mongoose');
//posts has many to 1 relation with user

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //reffereing to user
    },
    //include the array of ids of all comments in this post schema itself,adding comments array for fast retreival o all comments in the post
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment' //reffereing to comment
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like' 
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);//it is a model
module.exports = Post;