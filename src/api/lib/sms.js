const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const { env } = require('../../../src/infrastructure/env');
const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromEmail = env.TWILIO_EMAIL;
const fromMobile = env.TWILIO_PHONE_NUMBER;
const sendGridApiKey = env.SENDGRID_API_KEY;
/**
 * Send an SMS using Twilio
 * @param {string} to - Recipient phone number (in E.164 format, e.g. +1234567890)
 * @param {string} body - Message body
 * @returns {Promise} - Resolves with Twilio message response
 */
function sendSms(to, body) {
  return client.messages.create({
    body,
    from: "+15513688270",
    to
  });
}
/**
 * Send OTP via SMS and email using Twilio
 * @param {string} toPhone - Recipient phone number (in E.164 format)
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The OTP code to send
 * @returns {Promise} - Resolves when both SMS and email are sent
 */
async function sendOtp(toEmail, otp) {
  // Send SMS
  // Send Email via Twilio SendGrid
  sgMail.setApiKey(sendGridApiKey);
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Your OTP Code',
    text: otp,
  };
  await sgMail.send(msg);
}


/**
 * Send a "Contact Us" message via email using SendGrid
 * @param {string} fromEmail - Sender's email address
 * @param {string} message - The message content
 * @returns {Promise} - Resolves when the email is sent
 */
async function sendContactUs(to, title, messageData) {
  sgMail.setApiKey(sendGridApiKey);
  // Allow 'to' to be a single email or an array of emails
  const recipients = ['info@mycollegecards.com', 'collegecards.aj@gmail.com']
  const msg = {
    to: recipients, // SendGrid supports array of emails
    from: fromEmail,
    subject: 'CollegeCards Contact Us',
    text: messageData.message,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">

  <table width="600" align="center" cellpadding="0" cellspacing="0" 
         style="background:#fff; border:1px solid #ddd; border-radius:8px; padding:20px;">
    <tr>
      <td align="center" style="background:#000; color:#fff; padding:15px; border-radius:8px 8px 0 0;">
        <h2 style="margin:0;">📩 New Contact Message</h2>
      </td>
    </tr>

    <tr>
      <td style="padding:20px;">
        <p style="font-size:16px;">You have received a new message from your website contact form:</p>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:15px;">
          <tr style="background:#f3f3f3;">
            <td style="font-weight:bold; width:150px;">Name:</td>
            <td>${ messageData.name || '' }</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Email:</td>
            <td>${ messageData.email || '' }</td>
          </tr>
          <tr style="background:#f3f3f3;">
            <td style="font-weight:bold;">Inquiry Type:</td>
            <td>${ messageData.inquiryType || '' }</td>
          </tr>
          <tr>
            <td style="font-weight:bold; vertical-align:top;">Message:</td>
            <td>${ messageData.message || '' }</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:15px; font-size:13px; color:#777;">
        This message was sent from your website contact form.
      </td>
    </tr>
  </table>

</body>
</html>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error.response.body.errors)
    })
}


module.exports = {
  sendSms,
  sendOtp,
  sendContactUs
};