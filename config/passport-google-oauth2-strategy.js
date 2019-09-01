const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;//requiring oauth2 strategy
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url,
    },

    function(accessToken, refreshToken, profile, done){ //accessToken google gives just like jwt, refresh token= if access token is expired then refresh token creates a new access token without asking user to login, profile contains user information
        //find a user, user can have multiple emails thats why an array is there but we are using only one
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}

            console.log(profile);

            if (user){
                //if user found, set this user as req.user, req.user means sign in that user
                return done(null, user); // null means no error
            }else{
                //if not found, create thje user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex') //creating random password for user when he signs-up
                }, function(err, user){
                    if(err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }
        });

    }
));

module.exports = passport;