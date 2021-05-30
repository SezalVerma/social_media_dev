const nodemailer = require('nodemailer');
const ejs= require('ejs');
const path = require('path');

// refer nodemailer.comn & google smtp service for mails
// this code tells how email is to be sent
let transporter = nodemailer.createTransport({
    service : "gmail",
    //  smtp -> mail protocol ;;  smtp.gmail.com -> domain name created for developers to interact with
    host: "smtp.gmail.com",
    port: 587,     // for tls 
    secure: false, // true for 465, false for other ports
    auth: {
      user: "webmailer121@gmail.com", // generated ethereal user
      pass:  "mailer121", // generated ethereal password
    }
});

// what data is sent in email , relativepath -> ejs file to be sent in mailers folder
let renderTemplate = (data , relativePath) =>{
    let mailHTML ;
    ejs.renderFile(
        path.join(__dirname , '../views/mailers' , relativePath),
        data ,
        function(err , template){
            if(err){console.log("Err in rendering ejs of email" , err); return;}

            mailHTML = template;
        }    
    ) 
    return mailHTML;
};

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}