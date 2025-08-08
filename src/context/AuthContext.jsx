import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    toast.success("You have been logged out.");
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      logout();
      throw new Error("No token found, user logged out.");
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentToken}`,
      ...options.headers,
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      toast.error("Session expired. Please log in again.");
      logout();
      throw new Error('Session expired');
    }
    return response;
  }, [logout]);


  useEffect(() => {
    const verifyUser = async () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          // --- THIS IS THE FIX ---
          // The URL must include the /api prefix
          const response = await authFetch(`${API_URL}/api/users/profile`);
          if (!response.ok) throw new Error('Token verification failed');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error(error.message);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [authFetch]);

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