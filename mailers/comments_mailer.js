const nodeMailer = require('../config/nodemailer');


//this is another way of exporting a method 
exports.newComment = (comment) => {
    console.log('inside newComment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'practice.test123400@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString//'<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => { //info carries the information about the request which has been sent
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return; //you not need to return from here because it is running asynchrously but still we are returning
    });
}