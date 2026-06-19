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
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });

export default transporter;
