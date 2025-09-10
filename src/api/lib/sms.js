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
  try {
    return client.messages.create({
      body,
      from: "+15513688270",
      to
    });
  } catch (error) {
    console.error('Twilio SMS send error:', error);
    // throw error;
  }
}
/**
 * Send OTP via SMS and email using Twilio
 * @param {string} toPhone - Recipient phone number (in E.164 format)
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The OTP code to send
 * @returns {Promise} - Resolves when both SMS and email are sent
 */
async function sendOtp(toEmail, otp, message) {
  // Send SMS
  // Send Email via Twilio SendGrid
  const APP_NAME = "College Cards";
  const LOGO_URL = env.UPLOAD_URL + "/public/images/logo.png";

  sgMail.setApiKey(sendGridApiKey);
  const msg = {
    to: toEmail,
    from: "no-reply@em8513.mycollegecards.com", // Updated single sender
    subject: 'CollegeCards Your OTP Code',
    text: message,
    html: `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${ APP_NAME } — Your OTP Code</title>
    <style>
      html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
      * { -ms-text-size-adjust:100%; -webkit-text-size
      * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
      table, td { mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }
      img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
      a { text-decoration:none; }
      /* ----- iOS Blue Links ----- */
      a[x-apple-data-detectors], .unstyle-auto-detected-links a, .aBn { border-bottom:0 !important; cursor:default !important; color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }
      /* ----- Gmail Fix ----- */
      u + #body a { color: inherit; text-decoration: none; font-size: inherit; }
      /* ----- Button Hover (mostly webmail) ----- */
      .btn:hover { filter: brightness(1.1); }
      /* ----- Mobile Styles ----- */
      @media screen and (max-width:600px) {
        .container { width:100% !important; margin:0 auto !important; }
        .px { padding-left:20px !important; padding-right:20px !important; }
        .stack { display:block !important; width:100% !important; }
        .otp { font-size:28px !important; letter-spacing:8px !important; }
        .card { border-radius:16px !important; }
      }
      /* Light/Dark adjustments (limited client support) */
      @media (prefers-color-scheme: dark) {
        body, .bg-body { background:#0b0c0f !important; }
        .card { background:#111318 !important; color:#ffffff !important; }
        .muted { color:#9aa3b2 !important; }
        .brand { color:#a7b7ff !important; }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
        body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
      </style>
    <![endif]-->
  </head>
  <body id="body" class="bg-body" style="background:#f4f7fb; margin:0; padding:0;">
    <center role="article" aria-roledescription="email" lang="en" style="width:100%; background:#f4f7fb;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f7fb;">
        <tr>
          <td align="center" style="padding:24px;">
            <!-- Brand Header -->
            <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px;">
              <tr>
                <td align="center" class="px" style="padding:8px 32px 16px 32px;">
                  <!-- Logo (replace src) -->
                  <img src="${ LOGO_URL }" alt="logo" width="48" height="48" style="display:block; border-radius:12px;">
                  <div class="brand" style="font:700 18px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#2c4ccb; margin-top:8px;">
                    ${ APP_NAME }
                  </div>
                </td>
              </tr>
            </table>

            <!-- Card -->
            <table role="presentation" class="container card" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:20px; box-shadow:0 4px 20px rgba(0,0,0,0.06); overflow:hidden;">
              <tr>
                <td class="px" style="padding:28px 36px 8px 36px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#0b1533;">
                  <h1 style="margin:0 0 12px; font-size:22px; line-height:1.4; font-weight:700;">Your One-Time Passcode</h1>
                  <p class="muted" style="margin:0; font-size:14px; line-height:1.7; color:#55627a;">
                  Use the code below to reset your password.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:16px 36px 8px 36px;">
                  <!-- OTP Code -->
                  <div class="otp" style="display:inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:32px; letter-spacing:10px; font-weight:700; background:#f1f4ff; color:#1a2240; padding:14px 18px; border-radius:14px; border:1px solid #e4e9ff;">
                   ${ otp }
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 36px 24px 36px;">
                  <!-- CTA Button (optional deep-link) -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td class="btn" bgcolor="#2c4ccb" style="border-radius:12px;">
                        <a href="https://mycollegecards.com" target="_blank" style="display:inline-block; padding:12px 22px; font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#ffffff;">
                          Continue to ${ APP_NAME }
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="px" style="padding:8px 36px 24px 36px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                  <hr style="border:none; border-top:1px solid #eef1f6; margin:0 0 16px;">
                  <p class="muted" style="margin:0 0 6px; font-size:12px; color:#6b778c;">
                    • Do not share this code with anyone, including ${ APP_NAME } staff.<br>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px;">
              <tr>
                <td class="px" style="padding:16px 32px 8px 32px; text-align:center; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                  <p class="muted" style="margin:0; font-size:12px; color:#7d8aa2;">You are receiving this email because someone tried to sign in to ${ APP_NAME } with your address.</p>
                  <p class="muted" style="margin:6px 0 0; font-size:12px; color:#7d8aa2;">© ${ String(new Date().getFullYear()) } ${ APP_NAME } •</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`
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
    from: "no-reply@em8513.mycollegecards.com",
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