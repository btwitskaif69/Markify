const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Markify <onboarding@resend.dev>', // You can customize this
      to: [toEmail],
      subject: 'Reset Your Markify Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

     if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    // --- THIS IS THE FIX ---
    // Log the specific error message from Resend
    console.error('SPECIFIC ERROR FROM RESEND:', error); 
    throw error;
  }
};