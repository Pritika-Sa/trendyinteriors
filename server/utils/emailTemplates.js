// Professional email templates for TrendyInterios

const generateContactEmailHTML = (data) => {
  const { name, email, purpose, mobileNumber, message } = data;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Customer Inquiry - TrendyInterios</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);
        }
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          padding: 40px 20px;
          text-align: center;
          border-bottom: 4px solid #d4af37;
        }
        .logo {
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .tagline {
          color: #b0b0b0;
          font-size: 14px;
          font-weight: 300;
        }
        .badge {
          display: inline-block;
          background: #d4af37;
          color: #1a1a1a;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #d4af37;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #d4af37;
          padding-bottom: 10px;
        }
        .info-row {
          display: flex;
          margin-bottom: 15px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 6px;
          border-left: 4px solid #d4af37;
        }
        .info-label {
          color: #d4af37;
          font-weight: 600;
          min-width: 120px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #333333;
          flex: 1;
          font-size: 14px;
        }
        .message-box {
          background: #f8f8f8;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #d4af37;
          line-height: 1.8;
          color: #333333;
          font-size: 14px;
          word-wrap: break-word;
        }
        .cta-section {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-top: 30px;
          border: 2px solid #d4af37;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #d4af37 0%, #c4a027 100%);
          color: #1a1a1a;
          padding: 14px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 15px;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }
        .footer {
          background: #f0f0f0;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666666;
          border-top: 1px solid #e0e0e0;
        }
        .timestamp {
          color: #999999;
          font-size: 11px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">New Customer Inquiry</span>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="section">
            <div class="section-title">🔔 New Inquiry Received</div>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              A new customer inquiry has been submitted through the website. Please review the details below and respond promptly.
            </p>
          </div>

          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="info-row">
              <div class="info-label">Name</div>
              <div class="info-value">${name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value"><a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">${mobileNumber || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Project Type</div>
              <div class="info-value"><strong>${purpose}</strong></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📝 Message</div>
            <div class="message-box">
              ${message}
            </div>
          </div>

          <div class="cta-section">
            <strong style="color: #1a1a1a;">Ready to respond?</strong>
            <a href="mailto:${email}" class="cta-button">Reply to Customer</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Received: ${formattedDate}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated notification from your website. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateTestimonialEmailHTML = (data) => {
  const { name, testimonialText, rating, mobileNumber, postalAddress } = data;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const stars = '⭐'.repeat(rating);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Testimonial - TrendyInterios</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);
        }
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          padding: 40px 20px;
          text-align: center;
          border-bottom: 4px solid #d4af37;
        }
        .logo {
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .tagline {
          color: #b0b0b0;
          font-size: 14px;
          font-weight: 300;
        }
        .badge {
          display: inline-block;
          background: #d4af37;
          color: #1a1a1a;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #d4af37;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #d4af37;
          padding-bottom: 10px;
        }
        .rating {
          font-size: 28px;
          letter-spacing: 4px;
          margin: 15px 0;
        }
        .info-row {
          display: flex;
          margin-bottom: 15px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 6px;
          border-left: 4px solid #d4af37;
        }
        .info-label {
          color: #d4af37;
          font-weight: 600;
          min-width: 120px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #333333;
          flex: 1;
          font-size: 14px;
        }
        .testimonial-box {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.1) 100%);
          padding: 25px;
          border-radius: 8px;
          border-left: 5px solid #d4af37;
          line-height: 1.8;
          color: #333333;
          font-size: 15px;
          font-style: italic;
          word-wrap: break-word;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.1);
        }
        .cta-section {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-top: 30px;
          border: 2px solid #d4af37;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #d4af37 0%, #c4a027 100%);
          color: #1a1a1a;
          padding: 14px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 15px;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        .footer {
          background: #f0f0f0;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666666;
          border-top: 1px solid #e0e0e0;
        }
        .timestamp {
          color: #999999;
          font-size: 11px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">New Testimonial</span>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="section">
            <div class="section-title">⭐ New Customer Testimonial</div>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              A customer has shared their experience with TrendyInterios. Review and approve/moderate as needed.
            </p>
          </div>

          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="info-row">
              <div class="info-label">Name</div>
              <div class="info-value">${name}</div>
            </div>
            ${mobileNumber ? `
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">${mobileNumber}</div>
            </div>
            ` : ''}
            ${postalAddress ? `
            <div class="info-row">
              <div class="info-label">Location</div>
              <div class="info-value">${postalAddress}</div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Rating</div>
            <div class="rating">${stars}</div>
          </div>

          <div class="section">
            <div class="section-title">Testimonial Message</div>
            <div class="testimonial-box">
              "${testimonialText}"
            </div>
          </div>

          <div class="cta-section">
            <strong style="color: #1a1a1a;">Review & Approve this testimonial</strong>
            <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" class="cta-button">Go to Dashboard</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Received: ${formattedDate}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated notification from your website. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminLoginAlertHTML = (data) => {
  const { name, email } = data;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Login Alert - TrendyInterios</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 40px 20px; text-align: center; border-bottom: 4px solid #d4af37; }
        .logo { font-size: 32px; font-weight: 700; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px; }
        .tagline { color: #b0b0b0; font-size: 14px; font-weight: 300; }
        .badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #d4af37; font-size: 18px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        .info-box { background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37; }
        .info-row { margin-bottom: 12px; }
        .info-label { color: #d4af37; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { color: #333333; font-size: 14px; margin-top: 4px; }
        .alert-message { background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.1) 100%); padding: 20px; border-radius: 8px; border: 2px solid #d4af37; color: #1a1a1a; line-height: 1.6; font-size: 14px; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }
        .timestamp { color: #999999; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">Login Alert</span>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">🔐 Admin Login Detected</div>
            <div class="alert-message">
              An admin has logged into the TrendyInterios dashboard. If this was not you, please change your password immediately.
            </div>
          </div>
          <div class="section">
            <div class="section-title">Login Details</div>
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Admin Name</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email Address</div>
                <div class="info-value">${email}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Login Time</div>
                <div class="info-value">${formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Alert sent: ${formattedDate}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated security alert from your website.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePasswordChangeAlertHTML = (data) => {
  const { name, email } = data;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed - TrendyInterios</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 40px 20px; text-align: center; border-bottom: 4px solid #d4af37; }
        .logo { font-size: 32px; font-weight: 700; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px; }
        .tagline { color: #b0b0b0; font-size: 14px; font-weight: 300; }
        .badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #d4af37; font-size: 18px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        .info-box { background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37; }
        .info-row { margin-bottom: 12px; }
        .info-label { color: #d4af37; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { color: #333333; font-size: 14px; margin-top: 4px; }
        .confirmation-message { background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.1) 100%); padding: 20px; border-radius: 8px; border: 2px solid #d4af37; color: #1a1a1a; line-height: 1.6; font-size: 14px; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }
        .timestamp { color: #999999; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">Password Changed</span>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">✅ Password Successfully Changed</div>
            <div class="confirmation-message">
              Your admin password has been successfully changed. If you did not perform this action, please contact the system administrator immediately.
            </div>
          </div>
          <div class="section">
            <div class="section-title">Account Details</div>
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Admin Name</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email Address</div>
                <div class="info-value">${email}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Change Time</div>
                <div class="info-value">${formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Notification sent: ${formattedDate}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated security notification from your website.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePasswordResetOTPHTML = (data) => {
  const { otp } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP - TrendyInterios</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 40px 20px; text-align: center; border-bottom: 4px solid #d4af37; }
        .logo { font-size: 32px; font-weight: 700; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px; }
        .tagline { color: #b0b0b0; font-size: 14px; font-weight: 300; }
        .badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #d4af37; font-size: 18px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        .otp-box { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%); padding: 30px 20px; border-radius: 8px; border: 2px solid #d4af37; text-align: center; }
        .otp-label { color: #d4af37; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .otp-code { font-size: 48px; font-weight: 700; color: #1a1a1a; letter-spacing: 8px; font-family: 'Courier New', monospace; }
        .warning-box { background: #fff3cd; padding: 16px; border-radius: 8px; border-left: 4px solid #ffc107; color: #856404; font-size: 13px; line-height: 1.6; margin-top: 20px; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }
        .timestamp { color: #999999; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">Password Reset OTP</span>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">🔑 Password Reset Request</div>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              You have requested to reset your admin password. Use the OTP below to verify your identity.
            </p>
          </div>
          <div class="section">
            <div class="otp-box">
              <div class="otp-label">Your One-Time Password</div>
              <div class="otp-code">${otp}</div>
            </div>
            <div class="warning-box">
              ⚠️ <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone. If you did not request this, please ignore this email.
            </div>
          </div>
        </div>
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Sent: ${new Date().toLocaleString()}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated security notification from your website.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateChangePasswordOTPHTML = (data) => {
  const { otp } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Change Password OTP - TrendyInterios</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%); padding: 40px 20px; text-align: center; border-bottom: 4px solid #d4af37; }
        .logo { font-size: 32px; font-weight: 700; color: #d4af37; margin-bottom: 10px; letter-spacing: 2px; }
        .tagline { color: #b0b0b0; font-size: 14px; font-weight: 300; }
        .badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #d4af37; font-size: 18px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        .otp-box { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%); padding: 30px 20px; border-radius: 8px; border: 2px solid #d4af37; text-align: center; }
        .otp-label { color: #d4af37; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .otp-code { font-size: 48px; font-weight: 700; color: #1a1a1a; letter-spacing: 8px; font-family: 'Courier New', monospace; }
        .warning-box { background: #fff3cd; padding: 16px; border-radius: 8px; border-left: 4px solid #ffc107; color: #856404; font-size: 13px; line-height: 1.6; margin-top: 20px; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }
        .timestamp { color: #999999; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TrendyInterios</div>
          <div class="tagline">Luxury Interior Design Solutions</div>
          <span class="badge">Change Password OTP</span>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">🔑 Change Password Request</div>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              You have requested to change your admin password from the dashboard. Use the OTP below to verify your identity and proceed with the password change.
            </p>
          </div>
          <div class="section">
            <div class="otp-box">
              <div class="otp-label">Your One-Time Password</div>
              <div class="otp-code">${otp}</div>
            </div>
            <div class="warning-box">
              ⚠️ <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone. If you did not request this, please ignore this email.
            </div>
          </div>
        </div>
        <div class="footer">
          <strong>TrendyInterios Admin Dashboard</strong>
          <div class="timestamp">Sent: ${new Date().toLocaleString()}</div>
          <div style="margin-top: 10px; color: #999999;">
            This is an automated security notification from your website.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateContactEmailHTML,
  generateTestimonialEmailHTML,
  generateAdminLoginAlertHTML,
  generatePasswordChangeAlertHTML,
  generatePasswordResetOTPHTML,
  generateChangePasswordOTPHTML,
};
