const User = require('../models/user');
const ResetPassword = require('../models/reset_password');
const crypto = require('crypto');
const queue = require('../config/kue');
const resetPasswordEmailWorker = require('../workers/password_reset_worker');
const resetPasswordMailer = require('../mailers/password_reset_mailer');

module.exports.forgot = function(req, res){
    return res.render('reset_password',{
        title:"Codeial | Sign Up"
    }); 
}

module.exports.reset = async function(req, res){

    try{
        let email = await User.findOne({email: req.body.email});

        if(email){
            let resetPassword = await ResetPassword.create({
                user: email._id,
                accessToken: crypto.randomBytes(20).toString('hex'),
                isUsed: false
            });

            
            resetPassword.save();
            resetPassword = await resetPassword.populate('user', 'name email').execPopulate();
            //resetPasswordMailer.newResetPassword(resetPassword);

            let job = queue.create('preset_emails', resetPassword).save(function(err){ //a new job is being created in the queue.If there is no queue then it creates a queue, it is automatically handled when it is created and saved in db, job id is available to us
                //emails should be same as in comment_email_worker function queue.process, because worker is pinging in the emails queue
                if (err){
                    console.log('Error in creating a queue');
                    return;
                }

                console.log('job enqueued', job.id);
            });

            req.flash('success','Password recovery email sent to user');
            res.redirect('/reset_passwords/forgot');

        }else{
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/reset_passwords/forgot');
        }
    }catch(err){
        //console.log('Error', err);
        req.flash('error',err);
        return;
    }
};

module.exports.change = async function(req, res){
    try{
        let Reset = await ResetPassword.findOne({accessToken: req.params.token});

        if (Reset){
            if (Reset.isUsed == false){
                return res.render('change_password',{
                    title:"Codeial | Sign Up",
                    Reset:Reset
            });  
            }else{
                req.flash('error', 'Link Expired password was already changed');
                return res.redirect('/reset_passwords/forgot');
            }
        }
    }catch(err){
        //console.log('Error', err);
        req.flash('error',err);
        return;
    }

};

module.exports.changePassword = async function(req, res){
    try {
       // acessT = ResetPassword.findOne({accessToken : req.params.accessToken});

        if (req.body.password != req.body.confirm_password){
            console.log('Params',req.params.token)
            req.flash('error','Password and Confirm password dont match');
            return res.redirect('back'); // if password and confirm_password dont match then go back
            
        }else{

            let Reset = await ResetPassword.findOne({accessToken: req.params.token});
            let user = await User.findById(Reset.user);
            console.log('params',req.params)
            console.log('User',user)
            console.log('Reset',Reset)
            user.password = req.body.password;
            user.save();
            Reset.isUsed = true;
            Reset.save();
            req.flash('success','Password Changed');
            return res.redirect('/users/sign-in');
        }; 

    }catch(err){
        //console.log('Error', err);
        req.flash('error',err);
        return;
    } 
};
