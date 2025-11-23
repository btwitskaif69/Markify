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

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000";
const VERIFY_TIMEOUT_MS = 4000;
const PROTECTED_PATH_PREFIXES = ["/dashboard"];
const ADMIN_EMAILS = ["mohdkaif18th@gmail.com"];

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load from localStorage on first render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
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

  // Helper for secure fetch, potentially with timeout
  const secureFetch = useCallback(async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS); // Use VERIFY_TIMEOUT_MS for all secure fetches

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
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
        const response = await secureFetch(url, {
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      const response = await authFetch(`${API_URL}/api/users/profile`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Token verification failed");
      const userData = await response.json();
      saveUser(userData); // update localStorage user
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("User verification timed out.");
      } else {
        console.error("User verification failed:", error);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [token, authFetch]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = (userData, authToken) => {
    saveToken(authToken);
    saveUser(userData);
  };

  const authValue = useMemo(() => {
    const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

    return {
      user,
      token,
      login,
      logout,
      authFetch,
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
