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
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { setActualBranchId, clearEmulatedBranchId } = useBranch();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(undefined);
      setIsBootstrapping(false);
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }
    setIsAuthenticated(true);

    const hydrateUserSession = async () => {
      try {
        const res = await axiosInstance.get('/users');
        if (res?.data) {
          setUser({
            id: res.data.id,
            email: res.data.email,
            branchId: res.data.branchId,
            isSuperAdmin: Boolean(res.data.isSuperAdmin),
          });

          if (res.data.branchId) {
            setActualBranchId(res.data.branchId);
          }
        }
      } catch (error) {
        console.error('Unable to bootstrap auth session', { error });
        /*removeToken();
        clearBranchIdentifiers();
        clearEmulatedBranchId();
        setIsAuthenticated(false);
        setUser(undefined);
      if (window.location.pathname !== '/login') {
          navigate('/login');
        }*/
      } finally {
        setIsBootstrapping(false);
      }
    };

    hydrateUserSession();
  }, [
    clearBranchIdentifiers,
    clearEmulatedBranchId,
    navigate,
    setActualBranchId,
  ]);

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
          const userPayload = {
            branchId: res.data?.branchId ?? null,
            isSuperAdmin: Boolean(res.data?.isSuperAdmin),
          };
          setUser(userPayload);
          setIsBootstrapping(false);
          return {
            ...userPayload,
          };
        }

        return false;
      } catch (error) {
        console.error(`Unable to process login`, { error });
        setIsLoading(false);
        setIsAuthenticated(false);
        setIsBootstrapping(false);
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
        isBootstrapping,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
