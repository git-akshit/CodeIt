const User = require('../models/user');

//controllers fetches the views and send it to the browser when requests comes in
module.exports.profile = function(req, res){
    return res.render('user_profile',{ //name of html ejs file
        title: "Profile"
    });
}


//render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req, res){
   if (req.body.password != req.body.confirm_password){
       return res.redirect('back'); // if password and confirm_password dont match then go back
   }
   User.findOne({email: req.body.email}, function(err, user){
       if(err){console.log('error in finding user in signing up'); return}

       if (!user){ //when user is not found/there, then create it
           User.create(req.body, function(err,user){
            if(err){console.log('error in finding user in signing up'); return}

            return res.redirect('/users/sign-in');
           })
       }else{
           return res.redirect('back');
       }
   });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){
    
};