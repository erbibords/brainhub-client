<<<<<<< HEAD
import React, { createContext, useMemo, useState } from "react";
import useOfferings from "../hooks/useOfferings";

const OfferingsContext = createContext({
  courses: [],
  coursesLoading: false,
  coursesError: false,
=======
import React, { createContext, useMemo, useState, useContext } from "react";
import useOfferings from "../hooks/useOfferings";

const OfferingsContext = createContext({
  offerings: [],
  getOfferingsLoading: false,
  getOfferingsError: false,
>>>>>>> master
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
<<<<<<< HEAD
  } = useOfferings(params);
=======
  } = useOfferings("9bacb542-6bf7-4252-b353-bfe7e6d13c08", params);
>>>>>>> master

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
<<<<<<< HEAD
=======

export const useOfferingsContext = () => {
  return useContext(OfferingsContext);
};
>>>>>>> master
