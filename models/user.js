const mongoose = require('mongoose');

//So that user can be authenticated

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, //if this field is not entered then mongoose will throw error
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
},{
    timestamps: true //it handles created at and updated at
});

const User = mongoose.model('User', userSchema);

module.exports = User;