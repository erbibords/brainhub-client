import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { setToken, getToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(getToken(), !getToken());

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      Swal.fire({
        icon: "warning",
        title: "Your session has ended, please login again!",
        timer: 2000,
      });
    } else {
      setIsAuthenticated(true);
    }
  }, [getToken]);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post("/login", {
          email,
          password,
        });

        if (res) {
          setIsLoading(false);
          setIsAuthenticated(true);
          setToken(res.data.token);
          return true;
        }

        return false;
      } catch (error) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return false;
      }
    },
    [axiosInstance]
  );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
