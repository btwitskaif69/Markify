import { NextResponse } from "next/server";
import prisma from "@/server/db/prismaClient";
import { dodo } from "@/lib/dodopayments";

const ENV = globalThis?.process?.env || {};

const getFirstString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || null;

const getWebhookEvent = async (req) => {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const webhookSecret = ENV.DODO_PAYMENTS_WEBHOOK_SECRET?.trim();

  if (webhookSecret && webhookSecret !== "whsec_...") {
    return dodo.webhooks.unwrap(body, {
      headers,
      key: webhookSecret,
    });
  }

  // Fall back to unsafe parsing in local development when no webhook secret is configured yet.
  return dodo.webhooks.unsafeUnwrap(body);
};

const getEventContext = (data = {}) => {
  const customer = data.customer || data.customer_details || data.payer || {};
  const subscription = data.subscription || data;
  const metadata = data.metadata || subscription.metadata || customer.metadata || {};

  const userId = getFirstString(
    metadata.user_id,
    metadata.userId,
    metadata.userID,
    metadata.markify_user_id
  );

  const email = getFirstString(
    metadata.email,
    customer.email,
    customer.contact_email,
    data.customer_email,
    data.email
  );

  const customerId = getFirstString(
    customer.customer_id,
    customer.id,
    data.customer_id,
    data.customerId,
    subscription.customer_id,
    subscription.customer?.customer_id
  );

  const subscriptionId = getFirstString(
    subscription.subscription_id,
    data.subscription_id,
    data.subscriptionId,
    data.id
  );

  const nextBillingDate = getFirstString(
    subscription.next_billing_date,
    subscription.current_period_end,
    data.next_billing_date,
    data.nextBillingDate
  );

  return { userId, email, customerId, subscriptionId, nextBillingDate };
};

const buildWhereClause = ({ userId, email, customerId, subscriptionId }) => {
  const clauses = [];
  if (userId) clauses.push({ id: userId });
  if (email) clauses.push({ email });
  if (customerId) clauses.push({ dodoCustomerId: customerId });
  if (subscriptionId) clauses.push({ dodoSubscriptionId: subscriptionId });

  return clauses.length > 0 ? { OR: clauses } : null;
};

const updateSubscriptionState = async ({ where, isSubscribed, context }) => {
  if (!where) return;

  const data = {
    isSubscribed,
    ...(isSubscribed
      ? {
          dodoCustomerId: context.customerId || undefined,
          dodoSubscriptionId: context.subscriptionId || undefined,
          subscriptionEnds: context.nextBillingDate ? new Date(context.nextBillingDate) : null,
        }
      : {
          subscriptionEnds: null,
        }),
  };

  await prisma.user.updateMany({ where, data });
};

export async function POST(req) {
  try {
    const event = await getWebhookEvent(req);
    const context = getEventContext(event?.data || {});
    const where = buildWhereClause(context);

    switch (event?.type) {
      case "subscription.active":
      case "subscription.updated":
      case "subscription.renewed":
      case "subscription.plan_changed":
        await updateSubscriptionState({
          where,
          isSubscribed: true,
          context,
        });
        break;

      case "subscription.cancelled":
      case "subscription.canceled":
      case "subscription.expired":
      case "subscription.failed":
      case "subscription.on_hold":
        await updateSubscriptionState({
          where,
          isSubscribed: false,
          context,
        });
        break;

      case "payment.succeeded": {
        let subscription = null;
        if (context.subscriptionId) {
          try {
            subscription = await dodo.subscriptions.retrieve(context.subscriptionId);
          } catch (error) {
            console.warn("Failed to retrieve subscription for payment.succeeded:", error);
          }
        }

        const paymentContext = subscription
          ? getEventContext(subscription)
          : context;

        await updateSubscriptionState({
          where: buildWhereClause(paymentContext),
          isSubscribed: true,
          context: paymentContext,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
