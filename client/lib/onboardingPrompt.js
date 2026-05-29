"use client";

const ONBOARDING_PROMPT_KEY = "markify_onboarding_pending";
const ONBOARDING_SEEN_KEY = "markify_onboarding_seen";
const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

const getBrowserStorages = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const storages = [];

  try {
    storages.push(window.localStorage);
  } catch {
    // Ignore storage access issues.
  }

  try {
    storages.push(window.sessionStorage);
  } catch {
    // Ignore storage access issues.
  }

  return storages;
};

const parsePending = (raw) => {
  if (!raw) {
    return null;
  }

  if (raw === "1") {
    return { userId: "" };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      userId: typeof parsed?.userId === "string" ? parsed.userId : "",
    };
  } catch {
    return { userId: "" };
  }
};

const isPendingForUser = (pending, userId) => {
  if (!pending) {
    return false;
  }

  if (!pending.userId || !userId) {
    return true;
  }

  return pending.userId === userId;
};

const readPendingFromStorage = (storage) => {
  try {
    return parsePending(storage.getItem(ONBOARDING_PROMPT_KEY));
  } catch {
    return null;
  }
};

const parseSeen = (raw) => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const userId = typeof parsed?.userId === "string" ? parsed.userId.trim() : "";
    if (!userId) {
      return null;
    }

    return { userId };
  } catch {
    return null;
  }
};

const readSeenFromStorage = (storage) => {
  try {
    return parseSeen(storage.getItem(ONBOARDING_SEEN_KEY));
  } catch {
    return null;
  }
};

const writePendingToStorage = (storage, userId) => {
  try {
    storage.setItem(
      ONBOARDING_PROMPT_KEY,
      JSON.stringify({ userId: userId || "", createdAt: Date.now() })
    );
  } catch {
    // Ignore storage access issues.
  }
};

const clearPendingFromStorage = (storage) => {
  try {
    storage.removeItem(ONBOARDING_PROMPT_KEY);
  } catch {
    // Ignore storage access issues.
  }
};

const writeSeenToStorage = (storage, userId) => {
  try {
    storage.setItem(
      ONBOARDING_SEEN_KEY,
      JSON.stringify({ userId: userId || "", seenAt: Date.now() })
    );
  } catch {
    // Ignore storage access issues.
  }
};

const hasSeenForUser = (userId) =>
  getBrowserStorages().some((storage) => {
    const seen = readSeenFromStorage(storage);
    if (!seen) {
      return false;
    }

    return Boolean(userId) && seen.userId === userId;
  });

const hasPendingForUser = (userId) =>
  getBrowserStorages().some((storage) => isPendingForUser(readPendingFromStorage(storage), userId));

export const markOnboardingPending = (userId = "") => {
  const storages = getBrowserStorages();

  if (!storages.length) {
    return false;
  }

  storages.forEach((storage) => writePendingToStorage(storage, userId));

  if (IS_DEVELOPMENT) {
    console.debug("[onboarding] marked pending", { userId });
  }

  return true;
};

export const hasOnboardingPending = (userId = "") => hasPendingForUser(userId);

export const markOnboardingSeen = (userId = "") => {
  const storages = getBrowserStorages();

  if (!storages.length) {
    return false;
  }

  storages.forEach((storage) => writeSeenToStorage(storage, userId));

  if (IS_DEVELOPMENT) {
    console.debug("[onboarding] marked seen", { userId });
  }

  return true;
};

export const hasOnboardingSeen = (userId = "") => hasSeenForUser(userId);

export const consumeOnboardingPending = (userId = "") => {
  const storages = getBrowserStorages();

  if (!storages.length) {
    return false;
  }

  const isPending = storages.some((storage) =>
    isPendingForUser(readPendingFromStorage(storage), userId)
  );

  if (isPending) {
    storages.forEach(clearPendingFromStorage);

    if (IS_DEVELOPMENT) {
      console.debug("[onboarding] consumed pending", { userId });
    }
  }

  return isPending;
};
