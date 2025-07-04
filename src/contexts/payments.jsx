import React, { createContext, useMemo, useState, useContext } from "react";
import usePayments from "../hooks/usePayments";

const PaymentsContext = createContext({
  payments: [],
  getPaymentsLoading: false,
  getPaymentsError: false,
  setParams: (params) => {},
});

export const PaymentsProvider = ({ children }) => {
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

  const { data, isLoading, error } = usePayments(params);

  const values = useMemo(() => {
    return {
      payments: data,
      getPaymentsLoading: isLoading,
      getPaymentsError: error,
      setParams,
    };
  }, [data, isLoading, error, setParams]);

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
