const nodemailer =  require('../config/nodemailer');

exports.newComment =(comment)=> {
    let htmlString = nodemailer.renderTemplate({comment : comment} , '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: "'Codeial'<webmailer121@gmail.com>", // sender address
        to: comment.user.email , // list of receivers
        subject: "New Comment ✔", // Subject line
        html: htmlString,
      } , function(err, info){
          if(err){console.log("Err in sending mail from comments mailer",err); return;}
          console.log("Mail sent ");
          return;
      });
}