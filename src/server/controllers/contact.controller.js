import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message, phone, company } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required.',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        // Build email content
        const emailSubject = subject || 'General Inquiry';
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Subject:</strong> ${emailSubject}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Note:</strong> This message was sent from the Markify contact form.
            Reply directly to this email to respond to the sender.
          </p>
        </div>
      </div>
    `;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Markify Contact <noreply@markify.tech>',
            to: ['support@markify.tech'],
            replyTo: email,
            subject: `[Contact Form] ${emailSubject} - from ${name}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.',
            });
        }

        console.log(`Contact form submitted successfully. Email ID: ${data?.id}`);

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
};
