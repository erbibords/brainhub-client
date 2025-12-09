import React, { createContext, useMemo, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import usePayments from "../hooks/usePayments";
import { useAuth } from "./auth";

const PaymentsContext = createContext({
  payments: [],
  getPaymentsLoading: false,
  getPaymentsError: false,
  setParams: (params) => {},
  refreshPayments: () => {},
});

export const PaymentsProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    startDate: undefined,
    endDate: undefined,
    referenceNo: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    pageNo: 1,
    pageSize: 1000,
    programId: undefined,
  });

  const { data, isLoading, error, mutate } = usePayments(shouldFetch ? params : null);

  const values = useMemo(() => {
    return {
      payments: data,
      getPaymentsLoading: isLoading,
      getPaymentsError: error,
      setParams,
      refreshPayments: mutate,
    };
  }, [data, isLoading, error, setParams, mutate]);

  return (
    <PaymentsContext.Provider value={values}>
      {children}
    </PaymentsContext.Provider>
  );
};

export default PaymentsContext;

export const usePaymentsContext = () => {
  return useContext(PaymentsContext);
};
