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
import EditOfferings from "./pages/offerings/edit-offerings";
import ViewEnrollment from "./pages/enrollment/view-enrollment";
import ViewOffering from "./pages/offerings/view-offering";
import PrintEnrollment from "./pages/prints/print-enrollment";
import RevieweesPayments from "./pages/prints/reviewees-payments";
import RevieweesAccounting from "./pages/prints/reviewees-accounting";
import ReviewProgramAccounting from "./pages/prints/review-program-accounting";
import ReviewProgram from "./pages/program/review-program";
import Schools from "./pages/schools/schools";
import ViewOfferings from "./pages/offerings/view-offerings";
import Receipt from "./pages/prints/receipt-accounting";
import RevieweesPopulation from "./pages/prints/reviewees-population";
import PaymentPrintList from "./pages/prints/payment-print-list";

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
          <Route path="offerings/:offeringId" element={<ViewOffering />} />
          <Route path="/offerings/add" element={<AddOfferings />} />
          <Route
            path="/offerings/edit/:offeringId"
            element={<EditOfferings />}
          />
          <Route path="/offerings/:offeringId" element={<ViewOfferings />} />
          <Route path="/payments/list" element={<PaymentsList />} />
          <Route path="/payments/add/:studentId" element={<AddPayment />} />
          <Route path="/payments/:id" element={<ViewPayment />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<ViewCourse />} />
          <Route
            path="/enrollments/:enrollmentId"
            element={<ViewEnrollment />}
          />
          <Route
            path="/prints/enrollment/:studentId/:enrollmentId"
            element={<PrintEnrollment />}
          />
          <Route
            path="/prints/reviewees-payment/:Id"
            element={<RevieweesPayments />}
          />
          <Route
            path="/prints/reviewees-accounting/:Id"
            element={<RevieweesAccounting />}
          />
          <Route
            path="/prints/review-program-accounting/:Id"
            element={<ReviewProgramAccounting />}
          />
          <Route path="/prints/receipt-accounting/:Id" element={<Receipt />} />
          <Route
            path="/prints/reviewees-population/:Id"
            element={<RevieweesPopulation />}
          />
          <Route
            path="/prints/payment-list/:Id"
            element={<PaymentPrintList />}
          />

          <Route path="/review-program" element={<ReviewProgram />} />
          <Route path="/schools" element={<Schools />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
