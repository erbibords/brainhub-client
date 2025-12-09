import { createContext, useMemo, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useCourses from '../hooks/useCourses';
import { useAuth } from './auth';

const CoursesContext = createContext({
  courses: [],
  coursesLoading: false,
  coursesError: false,
  setParams: (params) => {},
});

export const CoursesProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    name: undefined,
    pageNo: 1,
    pageSize: 100,
  });

  const {
    courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses(shouldFetch ? params : null);

  const values = useMemo(() => {
    return {
      courses,
      getCoursesLoading: coursesLoading,
      getCoursesError: coursesError,
      setParams,
    };
  }, [courses, coursesLoading, coursesError, setParams]);

  return (
    <CoursesContext.Provider value={values}>{children}</CoursesContext.Provider>
  );
};

export const useCourse = () => {
  return useContext(CoursesContext);
};

export default CoursesContext;
