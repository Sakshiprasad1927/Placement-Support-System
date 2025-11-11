const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text }){
  // If SMTP not configured, fallback to console log for development
  if(!process.env.SMTP_HOST){
    console.log('Email (dev) ->', { to, subject, text });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM || 'no-reply@example.com', to, subject, text });
}

module.exports = sendEmail;
