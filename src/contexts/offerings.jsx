import React, { createContext, useMemo, useState } from "react";
import useOfferings from "../hooks/useOfferings";

const OfferingsContext = createContext({
  courses: [],
  coursesLoading: false,
  coursesError: false,
  setParams: (params) => {},
});

export const OfferingsProvider = ({ children }) => {
  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 25,
  });

  const {
    data,
    isLoading: getOfferingsLoading,
    error: getOfferingsError,
  } = useOfferings(params);

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
