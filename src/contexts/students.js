import React, { createContext, useState } from 'react';

// Create the context with default values
const StudentContext = createContext({
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
});

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const updateStudent = (updatedStudent) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
  };



  return (
    <StudentContext.Provider value={{ students, addStudent, updateStudent, removeStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
