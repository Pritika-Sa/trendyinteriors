const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

// For admin notifications
const sendAdminEmail = async function({ to = process.env.ADMIN_EMAIL, subject = 'Notification', text = '', html }) {
  if (!to) {
    console.warn('No admin email recipient provided');
    return Promise.resolve();
  }
  const msg = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com',
    to,
    subject,
    text,
    html,
  };
  
  try {
    console.log('[EMAIL] Attempting to send admin email to:', to);
    console.log('[EMAIL] Subject:', subject);
    const result = await transporter.sendMail(msg);
    console.log('[EMAIL] ✅ Email sent successfully to:', to);
    console.log('[EMAIL] Response:', result.response);
    return result;
  } catch (err) {
    console.error('[EMAIL] ❌ Email sending error to:', to);
    console.error('[EMAIL] Error details:', err.message);
    console.error('[EMAIL] Full error:', err);
    // Don't throw - allow operation to continue even if email fails
    return Promise.reject(err);
  }
};

// For user emails (password reset, etc.)
const sendUserEmail = async function({ email, subject, message }) {
  if (!email) throw new Error('Email address is required');
  
  const msg = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com',
    to: email,
    subject: subject,
    text: message,
  };
  
  try {
    console.log('Attempting to send email to:', email);
    const result = await transporter.sendMail(msg);
    console.log('Email sent successfully:', result.response);
    return result;
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
};

module.exports = sendUserEmail;
module.exports.sendAdminEmail = sendAdminEmail;
module.exports.sendUserEmail = sendUserEmail;
