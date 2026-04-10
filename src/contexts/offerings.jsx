import { createContext, useMemo, useState, useContext } from "react";
import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";
import useOfferings from "../hooks/useOfferings";
import { useAuth } from "./auth";

const OfferingsContext = createContext({
  offerings: [],
  getOfferingsLoading: false,
  getOfferingsError: false,
  setParams: () => {},
});

export const OfferingsProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const isOfferingsRoute =
    location.pathname === '/offerings' ||
    location.pathname.startsWith('/enrollments/edit-enrollment/') ||
    location.pathname === '/prints/offerings';
  const shouldFetch = isAuthenticated && !isLoginPage && isOfferingsRoute;
  const needsEnrollmentDetails =
    location.pathname === '/offerings' || location.pathname === '/prints/offerings';

  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 25, // Match offerings page default to avoid initial double-fetch mismatch
  });

  const {
    data,
    isLoading: getOfferingsLoading,
    error: getOfferingsError,
  } = useOfferings(
    shouldFetch
      ? {
          ...params,
          includeEnrollment: needsEnrollmentDetails,
        }
      : null
  );

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

OfferingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OfferingsContext;

export const useOfferingsContext = () => {
  return useContext(OfferingsContext);
};
