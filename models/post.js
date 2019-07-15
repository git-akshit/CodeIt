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
    }
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);//it is a model
module.exports = Post;