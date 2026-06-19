import { sendMail } from './config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Sending mode:', process.env.BREVO_API_KEY ? 'Brevo HTTPS API' : (process.env.RESEND_API_KEY ? 'Resend HTTPS API' : 'Gmail SMTP'));

const toEmail = process.env.TEST_RECEIVER_EMAIL || 'saveplused@gmail.com';

const mailOptions = {
  to: toEmail,
  subject: 'Test Email from SAVE+ with Brevo/Resend HTTPS API',
  html: '<h3>Hello!</h3><p>If you receive this, the HTTPS API (Brevo/Resend) is configured and working perfectly!</p>'
};

console.log(`Sending to: ${toEmail}...`);

sendMail(mailOptions)
  .then((result) => {
    console.log('Email sent successfully!', result);
  })
  .catch((error) => {
    console.error('Email sending failed:', error);
  });

