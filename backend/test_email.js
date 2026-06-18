import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'saveplused@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'eqwwirarctkgpphm'
  }
});

console.log('Using GMAIL_USER:', process.env.GMAIL_USER || 'saveplused@gmail.com');
console.log('Using GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD || 'eqwwirarctkgpphm');

const mailOptions = {
  from: process.env.GMAIL_USER || 'saveplused@gmail.com',
  to: 'saveplused@gmail.com', // send to itself for testing
  subject: 'Test Email from SAVE+',
  text: 'If you receive this, SMTP is configured correctly!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('SMTP test failed:', error);
  } else {
    console.log('SMTP test success:', info.response);
  }
});
