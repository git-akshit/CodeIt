const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // this defines the object id of the liked object
    likeable: {  //Object that is being liked, like post or comment
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    // this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']//enum restricts that likeable can only be post or comment
    }
}, {
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;