"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo
} from "react";
import PropTypes from "prop-types";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { secureFetch as secureApiFetch } from "@/client/lib/secureApi";
import { API_BASE_URL, AUTH_TIMEOUT_MS } from "@/client/lib/apiConfig";
import { getPlanKey, hasActiveProAccess } from "@/lib/subscription";

const AuthContext = createContext(null);
const PROTECTED_PATH_PREFIXES = ["/dashboard", "/admin"];
const PENDING_SUBSCRIPTION_KEY = "markify_pending_subscription";
const PENDING_SUBSCRIPTION_TTL_MS = 1000 * 60 * 60 * 24;
const SESSION_VERIFICATION_KEY = "markify_session_verification";
const SESSION_VERIFICATION_TTL_MS = 1000 * 60 * 10;
const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

const readStoredSessionVerification = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(SESSION_VERIFICATION_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    const userId = typeof parsed?.userId === "string" ? parsed.userId : "";
    const verifiedAt = Number(parsed?.verifiedAt || 0);

    if (!userId || !verifiedAt) {
      return null;
    }

    return { userId, verifiedAt };
  } catch {
    return null;
  }
};

const writeSessionVerification = (userId) => {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  sessionStorage.setItem(
    SESSION_VERIFICATION_KEY,
    JSON.stringify({ userId, verifiedAt: Date.now() })
  );
};

const clearSessionVerification = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(SESSION_VERIFICATION_KEY);
};

const hasFreshSessionVerification = (userId) => {
  if (typeof window === "undefined" || !userId) {
    return false;
  }

  const stored = readStoredSessionVerification();
  return Boolean(
    stored &&
      stored.userId === userId &&
      Date.now() - stored.verifiedAt < SESSION_VERIFICATION_TTL_MS
  );
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Load from localStorage on first render
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Validate that user has required fields
        if (!parsed || !parsed.id || !parsed.email) {
          console.warn("Invalid user data in localStorage, clearing...");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          clearSessionVerification();
          return null;
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
        clearSessionVerification();
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState(true);

  const saveToken = useCallback((authToken) => {
    if (typeof window === "undefined") return;
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
      clearSessionVerification();
    }
    setToken(authToken);
  }, []);

  const saveUser = useCallback((userData) => {
    if (typeof window === "undefined") return;
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      writeSessionVerification(userData.id);
    } else {
      localStorage.removeItem("user");
      clearSessionVerification();
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    saveToken(null);
    saveUser(null);
    toast.success("You have been logged out.");
    router.replace("/login");
  }, [router, saveToken, saveUser]);

  // Helper for fetch with encryption support and timeout
  const timedSecureFetch = useCallback(async (url, options = {}) => {
    const { timeoutMs = AUTH_TIMEOUT_MS, ...rest } = options;
    const controller = new AbortController();
    const timeoutId = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const response = await secureApiFetch(url, {
        ...rest,
        signal: controller.signal,
      });
      if (timeoutId) clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw error;
    }
  }, []);

  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!token) {
        logout();
        throw new Error("No token found. Please log in again.");
      }

      try {
        const response = await timedSecureFetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        });

        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
          throw new Error("Unauthorized");
        }

        return response;
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("Auth fetch aborted due to timeout.");
          toast.error("Request timed out. Please try again.");
          throw err;
        }
        console.error("Auth fetch failed:", err);
        toast.error("Network error. Please try again.");
        throw err;
      }
    },
    [token, logout, timedSecureFetch]
  );

  const reconcilePendingSubscription = useCallback(
    async (currentUser) => {
      if (typeof window === "undefined" || !token || !currentUser) {
        return false;
      }

      const pendingSubscriptionRaw = localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
      if (!pendingSubscriptionRaw) {
        return false;
      }

      try {
        const pendingSubscription = JSON.parse(pendingSubscriptionRaw);
        const startedAt = Number(pendingSubscription?.startedAt || 0);
        if (startedAt && Date.now() - startedAt > PENDING_SUBSCRIPTION_TTL_MS) {
          localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
          return false;
        }
      } catch {
        localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
        return false;
      }

      if (hasActiveProAccess(currentUser)) {
        localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
        return true;
      }

      try {
        const response = await fetch("/api/billing/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        const result = await response.json();
        if (response.ok && result?.user) {
          saveUser({ ...currentUser, ...result.user });
          localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
          return true;
        }

        console.warn("Pending subscription reconciliation returned:", response.status, result?.message);
      } catch (error) {
        console.warn("Pending subscription reconciliation failed:", error);
      }

      return false;
    },
    [token, saveUser]
  );

  const verifyUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      if (IS_DEVELOPMENT) {
        console.debug("[auth/profile] verifying session", {
          pathname,
          tokenPresent: Boolean(token),
        });
      }

      const response = await authFetch(`${API_BASE_URL}/users/profile`, {
        timeoutMs: AUTH_TIMEOUT_MS,
      });
      if (response.status === 404) {
        toast.error("Account not found. Please log in again.");
        logout();
        return;
      }
      if (!response.ok) {
        // Don't clear the session for transient server failures.
        console.warn("Skipping token verification because the profile endpoint returned:", response.status);
        return;
      }
      const userData = await response.json();
      saveUser(userData);

      if (typeof window !== "undefined") {
        if (hasActiveProAccess(userData)) {
          localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
        } else {
          void reconcilePendingSubscription(userData);
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Login verification took too long. Please try again.");
      } else if (error.message === "No token found. Please log in again.") {
        saveToken(null);
        saveUser(null);
      } else if (error.message !== "Unauthorized") {
        // Keep the existing session state if verification is unavailable.
        console.warn("User verification skipped:", error);
      }
      // "Unauthorized" errors are already handled by authFetch which calls logout()
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch, logout, saveToken, saveUser, reconcilePendingSubscription, pathname]);

  const login = useCallback((userData, authToken) => {
    saveToken(authToken);
    saveUser(userData);
  }, [saveToken, saveUser]);

  // Update profile in state (after profile edit)
  const updateProfile = useCallback((updatedUserData) => {
    if (updatedUserData) {
      // Merge with existing user data to preserve fields not returned by the API
      const mergedUser = { ...user, ...updatedUserData };
      saveUser(mergedUser);
    }
  }, [user, saveUser]);

  const authValue = useMemo(() => {
    const isAdmin = Boolean(user?.isAdmin);
    const hasProAccess = hasActiveProAccess(user);

    return {
      user,
      token,
      login,
      logout,
      authFetch,
      updateProfile,
      isAuthenticated: !!user,
      isLoading,
      isAdmin,
      hasProAccess,
      planKey: getPlanKey(user),
    };
  }, [user, token, login, logout, authFetch, isLoading, updateProfile]);

  const shouldVerifySession = PROTECTED_PATH_PREFIXES.some((path) =>
    (pathname || "").startsWith(path)
  );

  const shouldShowGlobalLoader =
    isLoading &&
    PROTECTED_PATH_PREFIXES.some((path) => (pathname || "").startsWith(path));

  useEffect(() => {
    if (!shouldVerifySession) {
      setIsLoading(false);
      return;
    }

    if (token && user?.id && hasFreshSessionVerification(user.id)) {
      if (IS_DEVELOPMENT) {
        console.debug("[auth/profile] session cache hit", {
          userId: user.id,
          pathname,
        });
      }

      setIsLoading(false);
      void reconcilePendingSubscription(user);
      return;
    }

    verifyUser();
  }, [shouldVerifySession, token, user, pathname, verifyUser, reconcilePendingSubscription]);

  return (
    <AuthContext.Provider value={authValue}>
      {shouldShowGlobalLoader ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
