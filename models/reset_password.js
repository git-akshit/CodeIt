const mongoose = require('mongoose');


const resetPasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    accessToken: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const resetPassword = mongoose.model('resetPassword', resetPasswordSchema);//it is a model
module.exports = resetPassword;