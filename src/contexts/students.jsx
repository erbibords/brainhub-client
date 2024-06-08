import React, { createContext, useCallback, useMemo, useState } from "react";
import { useStudents } from "../hooks/useStudents";
const StudentContext = createContext({
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
  studentLoading: false,
  studentError: false,
});

export const StudentProvider = ({ children }) => {
  const {
    data: students,
    isLoading: studentDataLoading,
    error: getStudentError,
  } = useStudents();

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const updateStudent = useCallback((updatedStudent) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  });

  const values = useMemo(() => {
    return {
      students,
      addStudent,
      updateStudent,
      studentDataLoading,
      getStudentError,
    };
  }, [students, addStudent, updateStudent]);

  return (
    <StudentContext.Provider value={values}>{children}</StudentContext.Provider>
  );
};

export default StudentContext;
