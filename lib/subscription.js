export const FREE_BOOKMARK_LIMIT = 20;
export const FREE_COLLECTION_LIMIT = 2;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const hasActiveProAccess = (user) => {
  if (!user?.isSubscribed) return false;

  const subscriptionEnds = parseDate(user.subscriptionEnds);
  if (!subscriptionEnds) return true;

  return subscriptionEnds.getTime() > Date.now();
};

export const getPlanKey = (user) => (hasActiveProAccess(user) ? "pro" : "free");
