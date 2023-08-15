const nodemailer = require('nodemailer');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');

// // Create a transporter using the SMTP settings for Outlook
// const transporter = nodemailer.createTransport({
//     // host: 'gmail',
//     host: 'smtp.office365.com',
//     port: 587,
//     auth: {
//         user: 'denish.prolink@gmail.com',
//         pass: 'prolink@D17'
//     }
// });

// Function to send an email
const sendEmail = async (to, subject, text) => {
    try {
        if (to) {

            // Create a transporter using the SMTP settings for Outlook
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: 'denish.prolink@gmail.com',
                    pass: 'prolink@D17'
                }
            });

            const mailOptions = {
                from: 'denish.prolink@gmail.com',
                to: to,
                subject: subject,
                text: text
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info.response;
        }
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

// // Define the email options
// const mailOptions = {
//     from: 'denish.prolink@gmail.com',
//     to: 'krushil.prolink@gmail.com',
//     subject: 'Hello from Denish Kunjadiya',
//     text: 'This is a test email sent Nodemailer with outlook as the sender.'
// };

// // Send the email
// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });


module.exports = { sendEmail }