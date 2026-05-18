import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import prisma from "../db/prismaClient";
import { hasActiveProAccess } from "@/lib/subscription";
import { sendFeatureRequestEmail } from "../services/email.service";

const trimValue = (value = "") => String(value || "").trim();
const allowedStatuses = new Set(["PENDING", "REVIEWED", "PLANNED", "DONE", "REJECTED"]);

const getCurrentMonthRangeUtc = () => {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { monthStart, nextMonthStart };
};

const featureRequestSelectSql = `
  SELECT
    fr."id",
    fr."title",
    fr."details",
    fr."source",
    fr."status",
    fr."createdAt",
    fr."updatedAt",
    json_build_object(
      'id', u."id",
      'name', u."name",
      'email', u."email",
      'avatar', u."avatar",
      'isSubscribed', u."isSubscribed",
      'subscriptionEnds', u."subscriptionEnds",
      'dodoCustomerId', u."dodoCustomerId",
      'dodoSubscriptionId', u."dodoSubscriptionId"
    ) AS "user"
  FROM "FeatureRequest" fr
  JOIN "User" u ON u."id" = fr."userId"
`;

const mapFeatureRequestRow = (row) => ({
  id: row.id,
  title: row.title,
  details: row.details,
  source: row.source,
  status: row.status,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  user: typeof row.user === "string" ? JSON.parse(row.user) : row.user,
});

const getFeatureRequestById = async (id) => {
  const rows = await prisma.$queryRaw`
    ${Prisma.raw(featureRequestSelectSql)}
    WHERE fr."id" = ${id}
  `;

  return rows[0] ? mapFeatureRequestRow(rows[0]) : null;
};

export const submitFeatureRequest = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const title = trimValue(req.body?.title);
    const details = trimValue(req.body?.details);
    const source = trimValue(req.body?.source) || "dashboard dropdown";

    if (title.length < 3 || title.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Please enter a feature title between 3 and 120 characters.",
      });
    }

    if (details.length < 10 || details.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Please describe the feature in at least 10 characters.",
      });
    }

    const { monthStart, nextMonthStart } = getCurrentMonthRangeUtc();
    const monthlyCountRows = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS "count"
      FROM "FeatureRequest"
      WHERE "userId" = ${req.user.id}
        AND "createdAt" >= ${monthStart}
        AND "createdAt" < ${nextMonthStart}
    `;
    const monthlyCount = Number(monthlyCountRows?.[0]?.count || 0);

    if (monthlyCount >= 2) {
      return res.status(429).json({
        success: false,
        message: "You can send up to 2 feature requests per month. Requests are reviewed by the team and are not guaranteed to be implemented.",
      });
    }

    const featureRequestId = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "FeatureRequest" ("id", "title", "details", "source", "status", "createdAt", "updatedAt", "userId")
      VALUES (
        ${featureRequestId},
        ${title},
        ${details},
        ${source || null},
        'PENDING',
        NOW(),
        NOW(),
        ${req.user.id}
      )
    `;

    const featureRequest = await getFeatureRequestById(featureRequestId);

    sendFeatureRequestEmail({
      name: req.user.name,
      email: req.user.email,
      title,
      details,
      source,
      plan: hasActiveProAccess(req.user) ? "Pro" : "Free",
      userId: req.user.id,
    }).catch((error) => {
      console.error("Failed to send feature request email:", error);
    });

    return res.status(201).json({
      success: true,
      message: "Feature request submitted successfully.",
      featureRequest,
    });
  } catch (error) {
    console.error("Feature request submission failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send feature request. Please try again later.",
    });
  }
};

export const getFeatureRequests = async (req, res) => {
  try {
    const rows = await prisma.$queryRaw`
      ${Prisma.raw(featureRequestSelectSql)}
      ORDER BY fr."createdAt" DESC
    `;

    return res.status(200).json(rows.map(mapFeatureRequestRow));
  } catch (error) {
    console.error("Error fetching feature requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feature requests.",
    });
  }
};

export const updateFeatureRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = String(req.body?.status || "").trim().toUpperCase();

    if (!allowedStatuses.has(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid feature request status.",
      });
    }

    await prisma.$executeRaw`
      UPDATE "FeatureRequest"
      SET "status" = ${status}, "updatedAt" = NOW()
      WHERE "id" = ${id}
    `;

    const featureRequest = await getFeatureRequestById(id);

    if (!featureRequest) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found.",
      });
    }

    return res.status(200).json(featureRequest);
  } catch (error) {
    console.error("Error updating feature request status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update feature request.",
    });
  }
};
