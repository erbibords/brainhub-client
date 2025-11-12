import React, { createContext, useMemo, useState, useContext } from "react";
import useCourses from "../hooks/useCourses";

const CoursesContext = createContext({
  courses: [],
  coursesLoading: false,
  coursesError: false,
  setParams: (params) => {},
});

export const CoursesProvider = ({ children }) => {
  const [params, setParams] = useState({
    name: undefined,
    pageNo: 1,
    pageSize: 100,
  });

  const {
    courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses(params);

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