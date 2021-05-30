const queue = require('../config/kue');
const commentsMailer = require('../mailer/comments_mailer');

//  queue title -> emails
queue.process('emails' , function(job , done){
    // console.log("Comment worker for job" , job.data);
    
    // caal to commentMailer that would sent email for a job in queue
    commentsMailer.newComment(job.data);
    done();
})