import React, { createContext, useMemo, useState, useContext } from "react";
import useEnrollments from "../hooks/useEnrollments";

const EnrollmentsContext = createContext({
  enrollments: [],
  getEnrollmentsLoading: false,
  getEnrollmentsError: false,
  setParams: (params) => {},
});

export const EnrollmentsProvider = ({ children }) => {
  const [params, setParams] = useState({
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    pageNo: 1,
    pageSize: 10000,
  });

  const { data, isLoading, error } = useEnrollments(params);

  const values = useMemo(() => {
    return {
      enrollments: data,
      getEnrollmentsLoading: isLoading,
      getEnrollmentsError: error,
      setParams,
    };
  }, [data, isLoading, error, setParams]);

  return (
    <EnrollmentsContext.Provider value={values}>
      {children}
    </EnrollmentsContext.Provider>
  );
};

export const useEnrollmentsContext = () => {
  return useContext(EnrollmentsContext);
};

export default EnrollmentsContext;
