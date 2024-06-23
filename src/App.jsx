import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Enrollment from "./pages/enrollment/enrollment";
import AddEnrollment from "./pages/enrollment/add-enrollment";
import Login from "./pages/login/login-page";
import Students from "./pages/students/students-list";
import StudentProfile from "./pages/students/student-profile";
import PaymentsList from "./pages/payments/payments-list";
import AddPayment from "./pages/payments/add-new-payment";
import ViewPayment from "./pages/payments/view-payment";
import Courses from "./pages/courses/course-list";
import ViewCourse from "./pages/courses/view-course";
import Layout from "./components/Layout/Layout";
import Offerings from "./pages/offerings/offerings";
import AddOfferings from "./pages/offerings/add-offerings";
import PrintEnrollment from "./pages/enrollment/print-enrollment";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/add-enrollment" element={<AddEnrollment />} />
          <Route path="/enrollments" element={<Enrollment />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:studentId" element={<StudentProfile />} />
          <Route path="/offerings" element={<Offerings />} />
          <Route path="/offerings/add" element={<AddOfferings />} />
          <Route path="/payments/list" element={<PaymentsList />} />
          <Route path="/payments/add" element={<AddPayment />} />
          <Route path="/payments/:id" element={<ViewPayment />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<ViewCourse />} />
          <Route path="/enrollments/:enrollmentId" element={<PrintEnrollment />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
