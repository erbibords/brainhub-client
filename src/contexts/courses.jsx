import React, { createContext, useCallback, useMemo, useState } from "react";
import useCourses from "../hooks/useCourses";
import axiosInstance from "../utils/axiosInstance";

const CoursesContext = createContext({
  courses: [],
  coursesLoading: false,
  coursesError: false,
  setParams: (params) => {},
  addCourse: () => {},
});

export const CoursesProvider = ({ children }) => {
  const [params, setParams] = useState({
    name: undefined,
    pageNo: 1,
    pageSize: 25,
  });

  const {
    data,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses(params);

  const values = useMemo(() => {
    return {
      data,
      getCoursesLoading: coursesLoading,
      getCoursesError: coursesError,
      setParams,
    };
  }, [data, coursesLoading, coursesError, setParams]);

  return (
    <CoursesContext.Provider value={values}>{children}</CoursesContext.Provider>
  );
};

export default CoursesContext;
