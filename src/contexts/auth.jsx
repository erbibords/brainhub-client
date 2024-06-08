import React, { createContext, useContext, useCallback, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const res = await axios.post("/login", {
          username: email,
          password,
        });
        console.log(res);
        if (res) {
          setIsLoading(false);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    },
    [axios]
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
