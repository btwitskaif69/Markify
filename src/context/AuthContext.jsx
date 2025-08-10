import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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

  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
    toast.success("You have been logged out.");
    navigate("/login");
  }, [navigate]);

  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!token) {
        logout();
        throw new Error("No token found. Please log in again.");
      }

      try {
        const response = await fetch(url, {
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
      const response = await authFetch(`${API_URL}/api/users/profile`);
      if (!response.ok) throw new Error("Token verification failed");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("User verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = (userData, authToken) => {
    saveToken(authToken);
    setUser(userData);
  };

  const authValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      authFetch,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, token, login, logout, authFetch, isLoading]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {isLoading ? (
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
