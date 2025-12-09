import { createContext, useMemo, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useEnrollments from '../hooks/useEnrollments';
import { useAuth } from './auth';

const EnrollmentsContext = createContext({
  enrollments: [],
  getEnrollmentsLoading: false,
  getEnrollmentsError: false,
  setParams: () => {},
});

export const EnrollmentsProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    pageNo: 1,
    pageSize: 4500,
    programId: undefined,
  });

  const { data, isLoading, error } = useEnrollments(
    shouldFetch ? params : null
  );

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
