import prisma from "../db/prismaClient";
import { sendIssueReportEmail } from "../services/email.service";

const ISSUE_REPORTS_PER_MONTH = 3;

const trimValue = (value = "") => String(value || "").trim();

const getCurrentMonthRangeUtc = () => {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { monthStart, nextMonthStart };
};

export const submitIssueReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const title = trimValue(req.body?.title);
    const details = trimValue(req.body?.details);
    const steps = trimValue(req.body?.steps);
    const pageUrl = trimValue(req.body?.pageUrl);
    const pagePath = trimValue(req.body?.pagePath);
    const browser = trimValue(req.body?.browser);
    const source = trimValue(req.body?.source) || "dashboard dropdown";

    if (title.length < 3 || title.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Please enter a short issue title between 3 and 120 characters.",
      });
    }

    if (details.length < 10 || details.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Please describe the issue in at least 10 characters.",
      });
    }

    if (steps.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Please keep the steps to reproduce under 2000 characters.",
      });
    }

    const { monthStart, nextMonthStart } = getCurrentMonthRangeUtc();
    const monthlyCount = await prisma.issueReport.count({
      where: {
        userId: req.user.id,
        createdAt: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
    });

    if (monthlyCount >= ISSUE_REPORTS_PER_MONTH) {
      return res.status(429).json({
        success: false,
        message: `You can send up to ${ISSUE_REPORTS_PER_MONTH} issue reports per month. Please wait until next month or contact support directly for urgent problems.`,
      });
    }

    const issueReport = await prisma.issueReport.create({
      data: {
        title,
        details,
        steps: steps || null,
        pageUrl: pageUrl || null,
        pagePath: pagePath || null,
        browser: browser || null,
        source,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    sendIssueReportEmail({
      name: req.user.name,
      email: req.user.email,
      title,
      details,
      steps,
      pageUrl,
      pagePath,
      browser,
      source,
    }).catch((error) => {
      console.error("Failed to send issue report email:", error);
    });

    return res.status(201).json({
      success: true,
      message: "Issue report submitted successfully.",
      issueReport,
    });
  } catch (error) {
    console.error("Issue report submission failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send issue report. Please try again later.",
    });
  }
};
