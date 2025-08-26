const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Markify <auth@mail.markify.tech>',
      to: [toEmail],
      subject: 'Reset Your Markify Password',
      html: `
        <div style="background-color:#111111; padding:40px; text-align:center; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:480px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <h2 style="color:#fff; margin-bottom:10px;">Forgot Your Password?</h2>
            <p style="color:#bbb; font-size:14px; line-height:1.5; margin-bottom:20px;">
              No problem. Enter your email address below and we’ll send you a link to reset it.
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
