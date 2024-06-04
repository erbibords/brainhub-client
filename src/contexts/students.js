import React, { createContext, useCallback, useMemo, useState } from 'react';

const StudentContext = createContext({
  students: [],
  getStudentStatus: 'loading' | 'ready' | 'error' | '404',
  addStudent: () => {},
  updateStudent: () => {},
});

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const updateStudent = useCallback((updatedStudent) => {
      setStudents(students.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      ));
  });

  const getStudents = useCallback(() => {
      setStudents([])
  })

  const values = useMemo(() => {
    return{ students, addStudent, updateStudent, removeStudent }
  }, [
    students, addStudent, updateStudent
  ])

  return (
    <StudentContext.Provider value={values}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
