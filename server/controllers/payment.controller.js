import { dodo } from "@/lib/dodopayments";
import prisma from "@/server/db/prismaClient";
import { hasActiveProAccess } from "@/lib/subscription";

const ENV = globalThis?.process?.env || {};

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const getSubscriptionUserId = (subscription = {}) =>
  subscription.metadata?.user_id ||
  subscription.metadata?.userId ||
  subscription.metadata?.userID ||
  subscription.metadata?.markify_user_id ||
  null;

const findMatchingActiveSubscriptionForUser = async (user) => {
  if (!ENV.DODO_PRO_PRODUCT_ID) {
    return null;
  }

  const query = {
    product_id: ENV.DODO_PRO_PRODUCT_ID,
    status: "active",
  };

  if (user?.dodoCustomerId) {
    query.customer_id = user.dodoCustomerId;
  }

  const targetEmail = normalizeEmail(user?.email);

  for await (const subscription of dodo.subscriptions.list(query)) {
    const subscriptionUserId = getSubscriptionUserId(subscription);
    const subscriptionEmail = normalizeEmail(subscription.customer?.email);
    const subscriptionCustomerId = subscription.customer?.customer_id || null;

    if (
      (subscriptionUserId && subscriptionUserId === user.id) ||
      (targetEmail && subscriptionEmail === targetEmail) ||
      (user?.dodoCustomerId && subscriptionCustomerId === user.dodoCustomerId)
    ) {
      return subscription;
    }
  }

  return null;
};

const resolveBillingCustomerId = async (user) => {
  if (user?.dodoCustomerId) {
    return user.dodoCustomerId;
  }

  if (user?.dodoSubscriptionId) {
    try {
      const subscription = await dodo.subscriptions.retrieve(user.dodoSubscriptionId);
      const customerId = subscription?.customer?.customer_id || subscription?.customer?.id || null;
      if (customerId) {
        return customerId;
      }
    } catch (error) {
      console.warn("Failed to resolve billing customer from subscription:", error);
    }
  }

  const subscription = await findMatchingActiveSubscriptionForUser(user);
  return subscription?.customer?.customer_id || subscription?.customer?.id || null;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { user } = req;
    const appUrl = ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const body = req.body || {};
    const requestedReturnUrl =
      typeof body.returnUrl === "string"
        ? body.returnUrl
        : typeof body.return_url === "string"
          ? body.return_url
          : "";
    const defaultReturnUrl = `${appUrl}/dashboard/${user.id}?billing=success`;
    const resolvedReturnUrl = (() => {
      if (!requestedReturnUrl) {
        return defaultReturnUrl;
      }

      try {
        if (requestedReturnUrl.startsWith("/")) {
          return `${appUrl}${requestedReturnUrl}`;
        }

        const parsed = new URL(requestedReturnUrl);
        return parsed.origin === new URL(appUrl).origin ? requestedReturnUrl : defaultReturnUrl;
      } catch {
        return defaultReturnUrl;
      }
    })();

    if (hasActiveProAccess(user)) {
      return res.status(200).json({
        url: `${appUrl}/dashboard/${user.id}`,
      });
    }
    
    if (!ENV.DODO_PRO_PRODUCT_ID) {
      return res.status(500).json({ message: "Product ID is not configured" });
    }

    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: ENV.DODO_PRO_PRODUCT_ID,
          quantity: 1,
        }
      ],
      customer: {
        email: user.email,
        name: user.name,
      },
      metadata: {
        user_id: user.id,
        user_email: user.email,
        plan_key: "pro",
      },
      cancel_url: `${appUrl}/dashboard/${user.id}`,
      return_url: resolvedReturnUrl,
    });

    return res.status(200).json({ url: session.checkout_url });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const confirmSubscriptionPurchase = async (req, res) => {
  try {
    const body = req.body || {};
    const subscriptionId =
      body.subscriptionId ||
      body.subscription_id ||
      req.query?.subscriptionId ||
      req.query?.subscription_id ||
      "";

    let subscription = null;
    if (subscriptionId) {
      try {
        subscription = await dodo.subscriptions.retrieve(subscriptionId);
      } catch (error) {
        console.warn("Failed to retrieve subscription by id, falling back to account lookup:", error);
      }
    }

    if (!subscription) {
      subscription = await findMatchingActiveSubscriptionForUser(req.user);
    }

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription could be verified for this account.",
      });
    }

    if (subscription.status !== "active") {
      return res.status(409).json({
        message: "Subscription is not active yet.",
      });
    }

    const metadataUserId = getSubscriptionUserId(subscription);
    if (metadataUserId && metadataUserId !== req.user.id) {
      return res.status(403).json({
        message: "Subscription does not belong to the current account.",
      });
    }

    const subscriptionEmail = subscription.customer?.email?.trim().toLowerCase();
    if (!metadataUserId && subscriptionEmail && subscriptionEmail !== req.user.email.trim().toLowerCase()) {
      return res.status(403).json({
        message: "Subscription email does not match the current account.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isSubscribed: true,
        dodoSubscriptionId: subscription.subscription_id || req.user.dodoSubscriptionId,
        dodoCustomerId: subscription.customer?.customer_id || req.user.dodoCustomerId,
        subscriptionEnds: subscription.next_billing_date
          ? new Date(subscription.next_billing_date)
          : req.user.subscriptionEnds,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isVerified: true,
        isSubscribed: true,
        subscriptionEnds: true,
        dodoCustomerId: true,
        dodoSubscriptionId: true,
        geminiUsage: true,
      },
    });

    return res.status(200).json({
      message: "Subscription synchronized successfully.",
      user: updatedUser,
      subscription,
    });
  } catch (error) {
    console.error("Subscription confirmation error:", error);
    return res.status(500).json({
      message: "Failed to synchronize subscription.",
    });
  }
};

export const createBillingPortalSession = async (req, res) => {
  try {
    const { user } = req;
    const appUrl = ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const customerId = await resolveBillingCustomerId(user);

    if (!customerId) {
      return res.status(404).json({
        message: "No billing portal is available for this account yet.",
      });
    }

    const session = await dodo.customers.customerPortal.create(customerId, {
      return_url: `${appUrl}/dashboard/${user.id}/billing`,
    });

    return res.status(200).json({
      url: session.link,
    });
  } catch (error) {
    console.error("Billing portal session error:", error);
    return res.status(500).json({
      message: "Failed to open the billing portal.",
    });
  }
};
