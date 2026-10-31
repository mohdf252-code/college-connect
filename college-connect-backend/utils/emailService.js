const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (user && pass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass, // 16-character Gmail App Password
      },
    });
  }
  return null;
};

const sendVerificationEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"College Connect" <${process.env.EMAIL_USER || "noreply@collegeconnect.com"}>`,
    to: email,
    subject: "Your College Connect Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
        <h2 style="color: #3b82f6; text-align: center; margin-bottom: 8px;">College<span style="color: #60a5fa;">Connect</span></h2>
        <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">Official Campus Community</p>
        
        <p style="font-size: 16px; color: #cbd5e1; margin-top: 24px;">Hello Student,</p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
          Thank you for joining College Connect! Please use the following 6-digit verification code to confirm your college email address:
        </p>
        
        <div style="background-color: #0f172a; border: 1px solid #3b82f6; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #60a5fa; font-family: monospace;">${otp}</span>
        </div>
        
        <p style="font-size: 13px; color: #94a3b8;">
          ⏰ This code will expire in <strong>10 minutes</strong>. If you did not request this, please disregard this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          © ${new Date().getFullYear()} College Connect. Connect, Collaborate & Grow.
        </p>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Verification email successfully sent to: ${email}`);
    } catch (err) {
      console.error(`❌ Error sending email to ${email}:`, err.message);
      // Helpful error message pointing out common Gmail App Password issues
      if (err.code === "EAUTH" || err.responseCode === 535) {
        throw new Error("Gmail authentication failed. Please verify your 16-character Google App Password in EMAIL_PASS.");
      }
      throw new Error(`Email delivery error: ${err.message}`);
    }
  } else {
    console.log(`\n=================================================`);
    console.log(`⚠️  EMAIL CREDENTIALS NOT CONFIGURED IN .env`);
    console.log(`📧  Target College Email : ${email}`);
    console.log(`🔑  VERIFICATION CODE (OTP): ${otp}`);
    console.log(`ℹ️   Set EMAIL_USER and EMAIL_PASS in .env to send real emails via Gmail.`);
    console.log(`=================================================\n`);
  }
};

module.exports = { sendVerificationEmail };
