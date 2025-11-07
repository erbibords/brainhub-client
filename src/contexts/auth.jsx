import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
  clearBranchIdentifiers,
  getToken,
  removeToken,
  setToken,
} from '../utils/token';
import { useNavigate } from 'react-router-dom';
import { useBranch } from './branch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const { setActualBranchId, clearEmulatedBranchId } = useBranch();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post('/login', {
          email,
          password,
        });

        if (res) {
          setIsLoading(false);
          setIsAuthenticated(true);
          setToken(res.data.token);
          if (res.data?.branchId) {
            setActualBranchId(res.data.branchId);
          }
          clearEmulatedBranchId();
          setUser({
            branchId: res.data?.branchId ?? null,
            isSuperAdmin: Boolean(res.data?.isSuperAdmin),
          });
          return true;
        }

        return false;
      } catch (error) {
        console.error(`Unable to process login`, { error });
        setIsLoading(false);
        setIsAuthenticated(false);
        return false;
      }
    },
    [clearEmulatedBranchId, setActualBranchId]
  );

  const logout = useCallback(() => {
    removeToken();
    clearBranchIdentifiers();
    clearEmulatedBranchId();
    setUser(undefined);
    setIsAuthenticated(false);
    navigate('/login');
    window.location.reload();
  }, [clearEmulatedBranchId, navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
