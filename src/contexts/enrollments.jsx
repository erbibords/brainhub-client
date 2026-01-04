import {
  createContext,
  useMemo,
  useState,
  useContext,
  useCallback,
} from 'react';
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

  const [params, setParamsState] = useState({
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    pageNo: 1,
    pageSize: 100, // Default to 100, will increase to 4500 when searching
    programId: undefined,
  });

  // Wrap setParams to merge with existing params instead of replacing
  const setParams = useCallback((newParams) => {
    setParamsState((prevParams) => {
      const merged = {
        ...prevParams,
        ...newParams,
      };
      return merged;
    });
  }, []);

  // Use params directly - let the page component control pageSize for proper server-side pagination
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
