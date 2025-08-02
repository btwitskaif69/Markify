import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs on initial load to verify the token
    const verifyUser = async () => {
      if (token) {
        try {
          // You would typically have a backend endpoint to verify the token
          // For now, we'll decode it on the client (less secure, but good for this example)
          const payload = JSON.parse(atob(token.split('.')[1]));
          // In a real app, fetch the full user object from `/api/users/${payload.id}`
          setUser({ id: payload.id });
        } catch (error) {
          // Token is invalid
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