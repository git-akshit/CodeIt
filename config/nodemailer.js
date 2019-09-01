const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')
const env = require('./environment');

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){ //callback
            if(err){console.log('error in rendering template',err); return}

            mailHTML = template;//if no error
        }
    )

    return mailHTML; //returning mailHTML here because if there is error above then it will displayed
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}