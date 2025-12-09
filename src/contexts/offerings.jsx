import React, { createContext, useMemo, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import useOfferings from "../hooks/useOfferings";
import { useAuth } from "./auth";

const OfferingsContext = createContext({
  offerings: [],
  getOfferingsLoading: false,
  getOfferingsError: false,
  setParams: (params) => {},
});

export const OfferingsProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 100,
  });

  const {
    data,
    isLoading: getOfferingsLoading,
    error: getOfferingsError,
  } = useOfferings(shouldFetch ? params : null);

  const values = useMemo(() => {
    return {
      data,
      getOfferingsLoading,
      getOfferingsError,
      setParams,
    };
  }, [data, getOfferingsLoading, getOfferingsError, setParams]);

  return (
    <OfferingsContext.Provider value={values}>
      {children}
    </OfferingsContext.Provider>
  );
};

export default OfferingsContext;

export const useOfferingsContext = () => {
  return useContext(OfferingsContext);
};
