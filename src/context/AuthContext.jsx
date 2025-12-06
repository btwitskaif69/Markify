import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { secureFetch as secureApiFetch } from "@/lib/secureApi";
import { API_BASE_URL, AUTH_TIMEOUT_MS } from "@/lib/apiConfig";

const AuthContext = createContext(null);
const PROTECTED_PATH_PREFIXES = ["/dashboard"];
const ADMIN_EMAILS = ["mohdkaif18th@gmail.com"];

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load from localStorage on first render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Validate that user has required fields
        if (!parsed || !parsed.id || !parsed.email) {
          console.warn("Invalid user data in localStorage, clearing...");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return null;
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const saveToken = (authToken) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(authToken);
  };

  const saveUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUser(userData);
  };

  const logout = useCallback(() => {
    saveToken(null);
    saveUser(null);
    toast.success("You have been logged out.");
    navigate("/login");
  }, [navigate]);

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
    [token, logout]
  );

  const verifyUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await authFetch(`${API_BASE_URL}/users/profile`, {
        timeoutMs: AUTH_TIMEOUT_MS,
      });
      if (response.status === 404) {
        toast.error("Account not found. Please log in again.");
        logout();
        return;
      }
      if (!response.ok) throw new Error("Token verification failed");
      const userData = await response.json();
      saveUser(userData);
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Login verification took too long. Please try again.");
      }
      console.error("User verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch, logout]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = (userData, authToken) => {
    saveToken(authToken);
    saveUser(userData);
  };

  // Update profile in state (after profile edit)
  const updateProfile = (updatedUserData) => {
    if (updatedUserData) {
      // Merge with existing user data to preserve fields not returned by the API
      const mergedUser = { ...user, ...updatedUserData };
      saveUser(mergedUser);
    }
  };

  const authValue = useMemo(() => {
    const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

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
    };
  }, [user, token, logout, authFetch, isLoading]);

  const shouldShowGlobalLoader =
    isLoading &&
    PROTECTED_PATH_PREFIXES.some((path) => location.pathname.startsWith(path));

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
