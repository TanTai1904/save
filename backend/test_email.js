import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const isResend = !!process.env.RESEND_API_KEY;

const transporter = isResend
  ? nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'saveplused@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'eqwwirarctkgpphm'
      }
    });

console.log('Sending mode:', isResend ? 'Resend SMTP' : 'Gmail SMTP');
if (isResend) {
  console.log('Using RESEND_API_KEY:', process.env.RESEND_API_KEY);
  console.log('Using RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev');
} else {
  console.log('Using GMAIL_USER:', process.env.GMAIL_USER || 'saveplused@gmail.com');
  console.log('Using GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD || 'eqwwirarctkgpphm');
}

// Resend free tier without a domain can only send to the email address registered with the account
// Gmail default test sending to GMAIL_USER
const toEmail = isResend ? (process.env.TEST_RECEIVER_EMAIL || 'saveplused@gmail.com') : (process.env.GMAIL_USER || 'saveplused@gmail.com');
const fromEmail = isResend ? (process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev') : (process.env.GMAIL_USER || 'saveplused@gmail.com');

const mailOptions = {
  from: `"SAVE+ Test" <${fromEmail}>`,
  to: toEmail,
  subject: 'Test Email from SAVE+ with Resend SMTP',
  text: 'If you receive this, Resend SMTP is configured correctly!'
};

console.log(`Sending from: ${fromEmail} to: ${toEmail}...`);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('SMTP test failed:', error);
  } else {
    console.log('SMTP test success:', info.response);
  }
});
