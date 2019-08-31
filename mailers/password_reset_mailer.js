const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method 
exports.newResetPassword = (resetPassword) => {
    console.log('inside resetPassword mailer', resetPassword);
    let htmlString = nodeMailer.renderTemplate({resetPassword: resetPassword}, '/comments/password_reset.ejs');

    nodeMailer.transporter.sendMail({
        from: 'practice.test123400@gmail.com',
        to: resetPassword.user.email,
        subject: "Reset Password",
        html: htmlString//'<h1>Hello</h1>'
    }, (err, info) => { 
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return; 
    });
}