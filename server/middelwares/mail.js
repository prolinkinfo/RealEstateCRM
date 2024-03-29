const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (to, subject, text) => {
    try {
        console.log("user---::", process.env.user)
        console.log("pass---::", process.env.pass)
        if (to && process.env.user && process.env.pass) {
            // Create a transporter using the SMTP settings for Outlook
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: process.env.user,
                    pass: process.env.pass
                }
            });

            const mailOptions = {
                from: process.env.user,
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