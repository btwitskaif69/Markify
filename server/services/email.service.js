import { Resend } from "resend";
import { getAdminEmails } from "../utils/admin";

const ENV = globalThis?.process?.env || {};
const RESEND_API_KEY = ENV.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const DEFAULT_ADMIN_NOTIFICATION_EMAIL = ENV.SUPPORT_EMAIL || "support@markify.tech";

if (!RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email sending is disabled.");
}

const ensureResend = () => {
  if (!resend) {
    throw new Error("Email service not configured. Set RESEND_API_KEY.");
  }
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const truncateText = (value = "", maxLength = 800) => {
  const text = String(value).trim();
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const formatHtmlText = (value = "", maxLength = 800) =>
  escapeHtml(truncateText(value, maxLength)).replace(/\n/g, "<br />");

const getAdminNotificationRecipients = () => {
  const recipients = getAdminEmails();
  if (recipients.length > 0) {
    return recipients;
  }

  return [DEFAULT_ADMIN_NOTIFICATION_EMAIL].filter(Boolean);
};

const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  ensureResend();
  const emailPayload = {
    from: "Markify <noreply@markify.tech>",
    to,
    subject,
    html,
  };

  if (text) {
    emailPayload.text = text;
  }

  if (replyTo) {
    emailPayload.replyTo = replyTo;
  }

  const { data, error } = await resend.emails.send({
    ...emailPayload,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    ensureResend();
    const data = await sendEmail({
      to: [toEmail],
      subject: "Reset Your Markify Password",
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
    return data;
  } catch (error) {
    console.error('SPECIFIC ERROR FROM RESEND:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    ensureResend();
    const data = await sendEmail({
      to: [toEmail],
      subject: "Verify Your Markify Account",
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
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    if (!resend) {
      console.warn("Skipping welcome email; RESEND_API_KEY is not set.");
      return null;
    }
    const firstName = userName ? userName.split(' ')[0] : 'there';
    const data = await sendEmail({
      to: [toEmail],
      subject: "Welcome to Markify! 🎉",
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
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw - welcome email is non-critical
    return null;
  }
};

export const sendSignupNotificationEmail = async ({ name, email, source = "email signup" }) => {
  try {
    if (!resend) {
      console.warn("Skipping signup notification; RESEND_API_KEY is not set.");
      return null;
    }

    const recipients = getAdminNotificationRecipients();
    if (recipients.length === 0) {
      console.warn("Skipping signup notification; no admin recipients configured.");
      return null;
    }

    const appUrl = ENV.FRONTEND_URL || ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const displayName = truncateText(name || email || "New user", 80);
    const safeName = escapeHtml(displayName);
    const safeEmail = escapeHtml(email || "Unknown email");
    const safeSource = escapeHtml(source);

    return await sendEmail({
      to: recipients,
      subject: `New Markify signup: ${displayName}`,
      html: `
        <div style="background-color:#111111; padding:40px; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:560px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <p style="margin:0 0 12px; color:#ff4500; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;">New account</p>
            <h2 style="color:#fff; margin:0 0 16px;">A new Markify user signed up</h2>
            <div style="background-color:#222; padding:18px; border-radius:8px; margin:20px 0; line-height:1.7;">
              <p style="margin:0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin:0;"><strong>Email:</strong> ${safeEmail}</p>
              <p style="margin:0;"><strong>Source:</strong> ${safeSource}</p>
              <p style="margin:0;"><strong>Time:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
            </div>
            <a href="${appUrl}/admin" style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:8px 0 0;">
              Open Admin Dashboard
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending signup notification email:", error);
    return null;
  }
};

export const sendReviewNotificationEmail = async ({
  name,
  email,
  rating,
  content,
  isUpdate = false,
}) => {
  try {
    if (!resend) {
      console.warn("Skipping review notification; RESEND_API_KEY is not set.");
      return null;
    }

    const recipients = getAdminNotificationRecipients();
    if (recipients.length === 0) {
      console.warn("Skipping review notification; no admin recipients configured.");
      return null;
    }

    const appUrl = ENV.FRONTEND_URL || ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const displayName = truncateText(name || email || "User", 80);
    const safeName = escapeHtml(displayName);
    const safeEmail = escapeHtml(email || "Unknown email");
    const safeContent = formatHtmlText(content || "", 1000);
    const safeRating = Number(rating) || 0;
    const actionLabel = isUpdate ? "updated" : "submitted";

    return await sendEmail({
      to: recipients,
      subject: `Markify review ${actionLabel}: ${displayName}`,
      html: `
        <div style="background-color:#111111; padding:40px; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:640px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <p style="margin:0 0 12px; color:#ff4500; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;">New review</p>
            <h2 style="color:#fff; margin:0 0 16px;">A user ${actionLabel} a review</h2>
            <div style="background-color:#222; padding:18px; border-radius:8px; margin:20px 0; line-height:1.7;">
              <p style="margin:0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin:0;"><strong>Email:</strong> ${safeEmail}</p>
              <p style="margin:0;"><strong>Rating:</strong> ${safeRating}/5</p>
              <p style="margin:0;"><strong>Status:</strong> Pending moderation</p>
            </div>
            <div style="background-color:#151515; padding:18px; border-radius:8px; border:1px solid #2a2a2a;">
              <p style="margin:0 0 8px; color:#bbb; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Review content</p>
              <div style="color:#fff; line-height:1.7; white-space:normal;">${safeContent}</div>
            </div>
            <a href="${appUrl}/admin?view=reviews" style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:16px 0 0;">
              Review in Admin
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending review notification email:", error);
    return null;
  }
};

export const sendIssueReportEmail = async ({
  name,
  email,
  title,
  details,
  steps = "",
  pageUrl = "",
  pagePath = "",
  browser = "",
  source = "dashboard dropdown",
}) => {
  try {
    if (!resend) {
      console.warn("Skipping issue report notification; RESEND_API_KEY is not set.");
      return null;
    }

    const recipients = getAdminNotificationRecipients();
    if (recipients.length === 0) {
      console.warn("Skipping issue report notification; no admin recipients configured.");
      return null;
    }

    const appUrl = ENV.FRONTEND_URL || ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const safeName = escapeHtml(truncateText(name || email || "User", 80));
    const safeEmail = escapeHtml(email || "Unknown email");
    const safeTitle = escapeHtml(truncateText(title || "Issue report", 140));
    const safeDetails = formatHtmlText(details || "", 4000);
    const safeSteps = formatHtmlText(steps || "", 2000);
    const safePageUrl = escapeHtml(truncateText(pageUrl, 300));
    const safePagePath = escapeHtml(truncateText(pagePath, 200));
    const safeBrowser = escapeHtml(truncateText(browser, 300));
    const safeSource = escapeHtml(truncateText(source, 120));
    const issueStepsText = steps ? truncateText(steps || "", 2000) : "";
    const issueStepsHtml = steps
      ? `
        <div style="background-color:#151515; padding:18px; border-radius:8px; border:1px solid #2a2a2a; margin:0 0 16px;">
          <p style="margin:0 0 8px; color:#bbb; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Steps to reproduce</p>
          <div style="color:#fff; line-height:1.7; white-space:normal;">${safeSteps}</div>
        </div>
      `
      : "";
    const plainTextBody = [
      "A user reported an issue",
      "",
      `Name: ${truncateText(name || email || "User", 80)}`,
      `Email: ${email || "Unknown email"}`,
      `Title: ${truncateText(title || "Issue report", 140)}`,
      `Source: ${source}`,
      "",
      "Issue details:",
      truncateText(details || "", 4000),
      "",
      steps ? "Steps to reproduce:" : null,
      issueStepsText || null,
      "",
      pagePath ? `Page path: ${pagePath}` : null,
      pageUrl ? `Page URL: ${pageUrl}` : null,
      browser ? `Browser: ${browser}` : null,
      "",
      `${appUrl}/admin`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return await sendEmail({
      to: recipients,
      subject: `Markify issue report: ${truncateText(title || "New issue", 80)}`,
      replyTo: email || undefined,
      text: plainTextBody,
      html: `
        <div style="background-color:#111111; padding:40px; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:680px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <p style="margin:0 0 12px; color:#ff4500; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;">Issue report</p>
            <h2 style="color:#fff; margin:0 0 16px;">A user reported an issue</h2>
            <div style="background-color:#222; padding:18px; border-radius:8px; margin:20px 0; line-height:1.7;">
              <p style="margin:0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin:0;"><strong>Email:</strong> ${safeEmail}</p>
              <p style="margin:0;"><strong>Title:</strong> ${safeTitle}</p>
              <p style="margin:0;"><strong>Source:</strong> ${safeSource}</p>
            </div>
            <div style="background-color:#151515; padding:18px; border-radius:8px; border:1px solid #2a2a2a; margin:0 0 16px;">
              <p style="margin:0 0 8px; color:#bbb; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Details</p>
              <div style="color:#fff; line-height:1.7; white-space:normal;">${safeDetails}</div>
            </div>
            ${issueStepsHtml}
            <div style="background-color:#151515; padding:18px; border-radius:8px; border:1px solid #2a2a2a; margin:0 0 16px;">
              <p style="margin:0 0 8px; color:#bbb; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Context</p>
              <p style="margin:0;"><strong>Page path:</strong> ${safePagePath || "Unknown"}</p>
              <p style="margin:0;"><strong>Page URL:</strong> ${safePageUrl || "Unknown"}</p>
              <p style="margin:0;"><strong>Browser:</strong> ${safeBrowser || "Unknown"}</p>
            </div>
            <a href="${appUrl}/admin" style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:8px 0 0;">Open Admin Dashboard</a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending issue report email:", error);
    throw error;
  }
};

export const sendFeatureRequestEmail = async ({
  name,
  email,
  title,
  details,
  source = "dashboard dropdown",
  plan = "Free",
  userId = "",
}) => {
  try {
    if (!resend) {
      console.warn("Skipping feature request notification; RESEND_API_KEY is not set.");
      return null;
    }

    const recipients = getAdminNotificationRecipients();
    if (recipients.length === 0) {
      console.warn("Skipping feature request notification; no admin recipients configured.");
      return null;
    }

    const appUrl = ENV.FRONTEND_URL || ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const safeName = escapeHtml(truncateText(name || email || "User", 80));
    const safeEmail = escapeHtml(email || "Unknown email");
    const safeTitle = escapeHtml(truncateText(title || "Feature request", 140));
    const safeDetails = formatHtmlText(details || "", 2000);
    const plainTextDetails = truncateText(details || "", 2000);
    const safeSource = escapeHtml(truncateText(source, 120));
    const safePlan = escapeHtml(truncateText(plan, 40));
    const safeUserId = escapeHtml(userId || "Unknown");
    const plainTextBody = [
      "A user requested a new feature",
      "",
      `Name: ${truncateText(name || email || "User", 80)}`,
      `Email: ${email || "Unknown email"}`,
      `Title: ${truncateText(title || "Feature request", 140)}`,
      `Plan: ${plan}`,
      `Source: ${source}`,
      `User ID: ${userId || "Unknown"}`,
      "",
      "Details:",
      plainTextDetails,
      "",
      `${appUrl}/admin`,
    ].join("\n");

    return await sendEmail({
      to: recipients,
      subject: `Markify feature request: ${truncateText(title || "New idea", 80)}`,
      replyTo: email || undefined,
      text: plainTextBody,
      html: `
        <div style="background-color:#111111; padding:40px; font-family:Arial, sans-serif; color:#fff;">
          <div style="max-width:640px; margin:auto; background-color:#1a1a1a; padding:30px; border-radius:12px; border:1px solid #333;">
            <p style="margin:0 0 12px; color:#ff4500; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;">Feature request</p>
            <h2 style="color:#fff; margin:0 0 16px;">A user requested a new feature</h2>
            <div style="background-color:#222; padding:18px; border-radius:8px; margin:20px 0; line-height:1.7;">
              <p style="margin:0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin:0;"><strong>Email:</strong> ${safeEmail}</p>
              <p style="margin:0;"><strong>Title:</strong> ${safeTitle}</p>
              <p style="margin:0;"><strong>Plan:</strong> ${safePlan}</p>
              <p style="margin:0;"><strong>Source:</strong> ${safeSource}</p>
              <p style="margin:0;"><strong>User ID:</strong> ${safeUserId}</p>
            </div>
            <div style="background-color:#151515; padding:18px; border-radius:8px; border:1px solid #2a2a2a;">
              <p style="margin:0 0 8px; color:#bbb; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Details</p>
              <div style="color:#fff; line-height:1.7; white-space:normal;">${safeDetails}</div>
            </div>
            <a href="${appUrl}/admin" style="display:inline-block; padding:12px 24px; background-color:#ff4500; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; margin:16px 0 0;">
              Open Admin Dashboard
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending feature request email:", error);
    throw error;
  }
};

