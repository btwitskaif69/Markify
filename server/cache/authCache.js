import { unstable_cache, revalidateTag } from "next/cache";
import prisma from "../db/prismaClient";
import { isAdminEmail } from "../utils/admin";
import { runWithPrismaRetry } from "../db/prismaRetry";

const AUTH_CACHE_PREFIX = "markify-auth-user";
const AUTH_CACHE_REVALIDATE_SECONDS = 10 * 60;
const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

export const authUserCacheTag = (userId) => `${AUTH_CACHE_PREFIX}:${userId}`;

const loadAuthUserFromDatabase = async (userId) => {
  if (IS_DEVELOPMENT) {
    console.debug("[auth/profile] cache miss lookup", { userId });
  }

  const user = await runWithPrismaRetry(
    () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          geminiUsage: true,
          hasSeenOnboarding: true,
          isSubscribed: true,
          subscriptionEnds: true,
          dodoCustomerId: true,
          dodoSubscriptionId: true,
        },
      }),
    { label: "Auth user lookup" }
  );

  if (!user) {
    return null;
  }

  return {
    ...user,
    isAdmin: isAdminEmail(user.email),
    showOnboarding: !user.hasSeenOnboarding,
  };
};

export const getCachedAuthUser = async (userId) => {
  if (!userId) {
    return null;
  }

  const cachedLookup = unstable_cache(
    async () => loadAuthUserFromDatabase(userId),
    [AUTH_CACHE_PREFIX, userId],
    {
      revalidate: AUTH_CACHE_REVALIDATE_SECONDS,
      tags: [authUserCacheTag(userId)],
    }
  );

  return cachedLookup();
};

export const invalidateAuthUserCache = async (userId) => {
  if (!userId) {
    return;
  }

  revalidateTag(authUserCacheTag(userId));
};
