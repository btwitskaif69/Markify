import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize the hook

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // In a real app, you would fetch the full user object here
          setUser({ id: payload.id });
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login'); // 3. Redirect to login page
  };

  const authValue = {
    user,
    token,
    login,
    logout,
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