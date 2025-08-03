import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const AuthContext = createContext(null);
const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    toast.success("You have been logged out."); // <-- Alert added here
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const authFetch = useCallback(async (url, options = {}) => {
    if (!token) {
      logout();
      throw new Error("No token found, user logged out.");
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // The "session expired" alert is already correctly handled here
    if (response.status === 401) {
      toast.error("Session expired. Please log in again.");
      logout();
      throw new Error('Session expired');
    }

    return response;
  }, [token, logout]);


  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const response = await authFetch(`${API_URL}/users/profile`);
          if (!response.ok) throw new Error('Token verification failed');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          // authFetch already handles the logout and alert
          console.error(error);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token, authFetch]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
  };
  
  const authValue = {
    user,
    token,
    login,
    logout,
    authFetch,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};