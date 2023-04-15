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


function createTableHtml(data) {
    let tableHtml = '<table border="1"><thead><tr>';
  
    // create table headers dynamically
    Object.keys(data[0]).forEach(key => {
      tableHtml += '<th>' + key + '</th>';
    });
  
    tableHtml += '</tr></thead><tbody>';
  
    // create table rows dynamically
    data.forEach(item => {
      tableHtml += '<tr>';
      Object.values(item).forEach(value => {
        tableHtml += '<td>' + value + '</td>';
      });
      tableHtml += '</tr>';
    });
  
    tableHtml += '</tbody></table>';
  
    return tableHtml;
  }


 const customizeMess=(details,email)=> {

 
    mailOptions = {
    from: '"Ecommerce" <taposhsharma2002@gmail.com>',
    to: `${email}`,
    subject: 'Your Order',
    html:   ` <p>Dear User,</p>
    <p>Please find below the details of your Order:</p>
    ${createTableHtml(details)}
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



module.exports = customizeMess

