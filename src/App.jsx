import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Enrollment from "./pages/enrollment/enrollment";
import Login from "./pages/login/login-page";
import Students from "./pages/students/students-list";
import StudentProfile from "./pages/students/student-profile";
import PaymentsList from "./pages/payments/payments-list";
import AddPayment from "./pages/payments/add-new-payment";
import ViewPayment from "./pages/payments/view-payment";
import Courses from "./pages/courses/course-list";
import ViewCourse from "./pages/courses/view-course";
import AddCourse from "./pages/courses/add-course";
import Navbar from "./components/NavBar/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

      

        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/students" element={<Students />} />
        <Route
          path="/students/profile/:studentId"
          element={<StudentProfile />}
        />
        <Route path="/payments/list" element={<PaymentsList />} />
        <Route path="/payments/add" element={<AddPayment />} />
        <Route path="/payments/:id" element={<ViewPayment />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/:courseId" element={<ViewCourse />} />
      </Routes>
    </Router>
  );
};

export default App;
