const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

//a worker is created which will send email instead of controller
//putting a job inside queue 
queue.process('emails', function(job, done){  //process completes the task in the queue
    console.log('emails worker is processing a job', job.data);

    commentsMailer.newComment(job.data); //data is the mail content sent to user

    done();
});