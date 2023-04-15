const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS:true,
    auth: {
        user: 'taposhsharma2002@gmail.com',
        pass: 'eijfjbjwgtpnchwd'
    }
});




 const customizeUser=(email)=> {

 
    mailOptions = {
    from: '"Ecommerce" <taposhsharma2002@gmail.com>',
    to: `${email}`,
    subject: 'Successfully Signup',
    html:   ` <p>Welcome User,</p>
    <p>You successfully joined.</p>
    
    <p>Thank you!</p>`
};
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
}



module.exports = customizeUser

