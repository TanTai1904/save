import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const isBrevo = !!process.env.BREVO_API_KEY;
const isResend = !isBrevo && !!process.env.RESEND_API_KEY;

// Gmail Transporter (SMTP fallback)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

/**
 * Unified sendMail function
 * Automatically chooses between Brevo HTTPS API, Resend HTTPS API, and Gmail SMTP
 */
export const sendMail = async ({ from, to, subject, html }) => {
  if (isBrevo) {
    console.log(`[Email] Sending via Brevo HTTPS API to ${to}...`);
    const senderEmail = process.env.BREVO_SENDER || 'saveplused@gmail.com';
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'SAVE+ Platform',
          email: senderEmail
        },
        to: [
          {
            email: to
          }
        ],
        subject,
        htmlContent: html
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Brevo API Error');
    }
    return data;
  } else if (isResend) {
    console.log(`[Email] Sending via Resend HTTPS API to ${to}...`);
    const fromAddress = from || `"SAVE+ Platform" <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`;
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Resend API Error');
    }
    return data;
  } else {
    console.log(`[Email] Sending via Gmail SMTP to ${to}...`);
    const fromAddress = from || `"SAVE+ Platform" <${process.env.GMAIL_USER}>`;
    return await gmailTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html
    });
  }
};

export default gmailTransporter;


