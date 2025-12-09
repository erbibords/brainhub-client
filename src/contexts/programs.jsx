import React, { createContext, useMemo, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import usePrograms from "../hooks/usePrograms";
import { useAuth } from "./auth";

const ProgramsContext = createContext({
  programs: [],
  programsLoading: false,
  programsError: false,
  setParams: (params) => {},
});

export const ProgramsProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    name: undefined,
    pageNo: 1,
    pageSize: 100,
  });

  const { programs, isLoading, error } = usePrograms(shouldFetch ? params : null);

  const values = useMemo(() => {
    return {
      programs,
      getProgramsLoading: isLoading,
      getProgramsError: error,
      setParams,
    };
  }, [programs, isLoading, error, setParams]);

  return (
    <ProgramsContext.Provider value={values}>
      {children}
    </ProgramsContext.Provider>
  );
};

export const useProgramContext = () => {
  return useContext(ProgramsContext);
};

export default ProgramsContext;
