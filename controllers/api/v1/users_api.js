
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email}); //finding email of user

        if ( !user || user.password != req.body.password){ //if user is not found or password not matches
            return res.json(422, {
                message: "Invalid username or password"
            });
        }

        return res.json(200, {
            message: 'Sign in successful, here is your token, plese keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn : '100000'}) // converting the user to json, codeial is same key for encrypting and decrypting
            }
        })

    }catch(err){
        console.log('Error', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }

};