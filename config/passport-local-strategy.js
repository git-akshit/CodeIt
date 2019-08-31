const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy // requiring Strategy from passport-local

const User = require('../models/user');

//authenticate using passport
//passport is local-strategy to found out which user signed in
passport.use(new LocalStrategy({
         usernameField: 'email', //usernameField should be email as it is syntax
         passReqToCallback: true //it allows us to set first argument as req below
    },
    function(req, email, password, done){ //done is a callback function, done handles errors and when fuction is successful 
        //find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                //console.log('Error in finding user --> Passport');
                req.flash('error',err);
                return done(err); //this will tell passport an error occured
            }

            if(!user || user.password != password){//if user not found or password dosent match
                //console.log('Invalid Username/Password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false); // it takes 2 arguments 1-error, 2-authentication successful or not, here no error thats why null and authentication is failed
            }

            return done(null,user); // authentication was success, user found,it will return the user to serialize
        });
    }

));

//serializing the user to decide which key is to be kept in the cookies
//passport stores the user_id in cookies in encrypted format
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user from the key in the cookies
//browser has the key in cookies, it sends the key to server, and server checks this key belongs to which user and responds
//browser makes the request with key and we deserialize it
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err); //this will tell passport an error occured
        }

        return done(null, user); //else return user as user found
    });
});

//sendind the details of logged in user to views
//check if the user is authenticated
passport.checkAuthentication = function(req, res,next){ // it is used as middleware because of next
    if(req.isAuthenticated()){ // it checks if user is authenticated or not
        //if the user is signed in, then pass on the request to the next function(controllers's action) 
       return next();//user is signed in then pass him on the page
    }
    //if the user is not signed in/authenticated then sends to sign-in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user; // whenever the user is signed then the information for that user is stored in req.user, transfering it to response locals
    }
    next();
}

module.exports = passport;