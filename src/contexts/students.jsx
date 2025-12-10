import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import useStudents from '../hooks/useStudents';
import axiosInstance from '../utils/axiosInstance';
import { DEFAULT_BRANCH_ID } from '../constants';
import { useAuth } from './auth';

const StudentContext = createContext({
  students: [],
  addStudent: () => {},
  studentLoading: false,
  studentError: false,
  setParams: (params) => {},
});

export const StudentProvider = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const shouldFetch = isAuthenticated && !isLoginPage;

  const [params, setParams] = useState({
    studentName: undefined,
    schoolId: undefined,
    offeringType: undefined,
    pageNo: 1,
    pageSize: 100, // Default to 100, will increase to 5000 when searching
  });

  // Use params directly - let the page component control pageSize for proper server-side pagination
  const {
    data: students,
    isLoading: studentDataLoading,
    error: getStudentError,
  } = useStudents(shouldFetch ? params : null);

  const addStudent = useCallback(
    async ({
      firstName,
      lastName,
      middleName = '',
      schoolId,
      address,
      age,
      contactNumber,
      email,
      emergencyContact,
    }) => {
      try {
        const res = await axiosInstance.post(
          `branches/${DEFAULT_BRANCH_ID()}/students`,
          {
            firstName,
            lastName,
            middleName: middleName ?? '',
            schoolId,
            address,
            age,
            contactNumber,
            email,
            emergencyContact,
          }
        );

        if (res.data) {
          return res.data;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [axiosInstance]
  );

  const values = useMemo(() => {
    return {
      students,
      studentDataLoading,
      getStudentError,
      setParams,
      addStudent,
    };
  }, [students, studentDataLoading, getStudentError, setParams, addStudent]);
  return (
    <StudentContext.Provider value={values}>{children}</StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  return useContext(StudentContext);
};

export default StudentContext;
