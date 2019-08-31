const queue = require('../config/kue');

const passwordResetMailer = require('../mailers/password_reset_mailer');

//a worker is created which will send email instead of controller
//putting a job inside queue 
queue.process('preset_emails', function(job, done){  //process completes the task in the queue
    console.log('password reset emails worker is processing a job', job.data);

    passwordResetMailer.newResetPassword(job.data);  //data is the mail content sent to user

    done();
});