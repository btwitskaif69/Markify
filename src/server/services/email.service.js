import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Markify <noreply@markify.tech>',
      to: [toEmail],
      subject: 'Reset Your Markify Password',
      html: `
        <div style="background-color:#111111; padding:40px; text-align:center; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:480px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <h2 style="color:#fff; margin-bottom:10px;">Forgot Your Password?</h2>
            <p style="color:#bbb; font-size:14px; line-height:1.5; margin-bottom:20px;">
              No problem. Enter your email address below and we'll send you a link to reset it.
            </p>
            <a href="${resetLink}" 
               style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:20px 0;">
              Reset Password
            </a>
            <p style="color:#777; font-size:12px; margin-top:20px;">
              This link will expire in 1 hour. If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('SPECIFIC ERROR FROM RESEND:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Markify <noreply@markify.tech>',
      to: [toEmail],
      subject: 'Verify Your Markify Account',
      html: `
        <div style="background-color:#111111; padding:40px; text-align:center; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:480px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <h2 style="color:#fff; margin-bottom:10px;">Verify Your Email</h2>
            <p style="color:#bbb; font-size:14px; line-height:1.5; margin-bottom:20px;">
              Use the code below to verify your email address and complete your registration.
            </p>
            <div style="background-color:#222; padding:20px; border-radius:8px; margin:20px 0;">
              <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#ff4500;">${code}</span>
            </div>
            <p style="color:#777; font-size:12px; margin-top:20px;">
              This code will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    const firstName = userName ? userName.split(' ')[0] : 'there';
    const { data, error } = await resend.emails.send({
      from: 'Markify <noreply@markify.tech>',
      to: [toEmail],
      subject: 'Welcome to Markify! 🎉',
      html: `
        <div style="background-color:#111111; padding:40px; text-align:center; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:480px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <div style="font-size:48px; margin-bottom:10px;">🔖</div>
            <h2 style="color:#fff; margin-bottom:10px;">Welcome to Markify, ${firstName}!</h2>
            <p style="color:#bbb; font-size:14px; line-height:1.6; margin-bottom:20px;">
              We're thrilled to have you on board! Markify is your personal bookmark manager designed to help you save, organize, and access your favorite links effortlessly.
            </p>
            <div style="background-color:#222; padding:20px; border-radius:8px; margin:20px 0; text-align:left;">
              <p style="color:#ff4500; font-weight:bold; margin-bottom:10px;">Here's what you can do:</p>
              <ul style="color:#bbb; font-size:14px; line-height:1.8; padding-left:20px; margin:0;">
                <li>📚 Save bookmarks with one click</li>
                <li>📁 Organize with collections</li>
                <li>🔍 Search instantly with Ctrl+K</li>
                <li>⭐ Mark favorites for quick access</li>
                <li>📤 Import/Export in multiple formats</li>
              </ul>
            </div>
            <a href="https://markify.tech/login" 
               style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:20px 0;">
              Go to Dashboard
            </a>
            <p style="color:#777; font-size:12px; margin-top:20px;">
              Have questions? Just reply to this email - we'd love to hear from you!
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw - welcome email is non-critical
    return null;
  }
};

