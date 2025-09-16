import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useContext,
} from "react";
import useStudents from "../hooks/useStudents";
import axiosInstance from "../utils/axiosInstance";
import { DEFAULT_BRANCH_ID } from "../constants";

const StudentContext = createContext({
  students: [],
  addStudent: () => {},
  studentLoading: false,
  studentError: false,
  setParams: (params) => {},
});

export const StudentProvider = ({ children }) => {
  const [params, setParams] = useState({
    studentName: undefined,
    school: undefined,
    pageNo: 1,
    pageSize: 5000,
  });
  const {
    data: students,
    isLoading: studentDataLoading,
    error: getStudentError,
  } = useStudents(params);

  const addStudent = useCallback(
    async ({
      firstName,
      lastName,
      middleName = "",
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
            middleName: middleName ?? "",
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
