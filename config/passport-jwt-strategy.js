const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; //it will help extract jwt from header

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //AuthHeader has Bearer Token
    secretOrKey: 'codeial'
}

//telling passport to use jwt
passport.use(new JWTStrategy(opts, function(jwdPayLoad, done){ // done is a callback function
//here jwdPayLoad._id has user id
    User.findById(jwdPayLoad._id, function(err, user){
        if (err){console.log('Error in finding user from JWT'); return;}
//here we are every time checking that the user is there or not, id is present in payload
        if (user){
            return done(null, user); // error is null and returning user
        }else{
            return done(null, false); // false means that the user was not found
        }
    })

}));

module.exports = passport;