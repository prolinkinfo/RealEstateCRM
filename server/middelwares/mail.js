const nodemailer = require('nodemailer');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');

// Function to send an email
const sendEmail = async (to, subject, text) => {
    try {
        if (to) {

            // Create a transporter using the SMTP settings for Outlook
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: 'prolink@gmail.com',
                    pass: 'emailpass@17'
                }
            });

            const mailOptions = {
                from: 'prolink@gmail.com',
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


module.exports = { sendEmail }