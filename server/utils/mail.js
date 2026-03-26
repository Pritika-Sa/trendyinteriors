const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// For admin notifications
const sendAdminEmail = async function({
  to = process.env.ADMIN_EMAIL,
  subject = 'Notification',
  text,
  html,
}) {
  if (!to) {
    console.warn('No admin email recipient provided');
    return Promise.resolve();
  }

  // ✅ Fix here
  const finalText = text || "No content provided";
  const finalHtml = html || "<p>No content provided</p>";

  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text: finalText,
    html: finalHtml,
  };

  try {
    console.log('[EMAIL] Attempting to send admin email to:', to);
    const result = await sgMail.send(msg);
    console.log('[EMAIL] ✅ Email sent successfully to:', to);
    return result;
  } catch (err) {
    console.error('[EMAIL] ❌ Email sending error:', err.response?.body || err.message);
    return Promise.reject(err);
  }
};

// For user emails
const sendUserEmail = async function({ email, subject, message }) {
  if (!email) throw new Error('Email address is required');

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject,
    text: message || "No message provided",
  };

  try {
    console.log('Attempting to send email to:', email);
    const result = await sgMail.send(msg);
    console.log('Email sent successfully');
    return result;
  } catch (err) {
    console.error('Email sending error:', err.response?.body || err.message);
    throw err;
  }
};

module.exports = sendUserEmail;
module.exports.sendAdminEmail = sendAdminEmail;
module.exports.sendUserEmail = sendUserEmail;