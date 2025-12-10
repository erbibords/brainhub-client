// import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
// import { withProviders } from './components/Providers/PageProviders';

// Import pages
import Login from './pages/login/login-page';
import Enrollment from './pages/enrollment/enrollment';
import AddEnrollment from './pages/enrollment/add-enrollment';
import EditEnrollment from './pages/enrollment/edit-enrollment';
import Students from './pages/students/students-list';
import StudentProfile from './pages/students/student-profile';
import PaymentsList from './pages/payments/payments-list';
import AddPayment from './pages/payments/add-new-payment';
import ViewPayment from './pages/payments/view-payment';
import Courses from './pages/courses/course-list';
import ViewCourse from './pages/courses/view-course';
import Offerings from './pages/offerings/offerings';
import AddOfferings from './pages/offerings/add-offerings';
import EditOfferings from './pages/offerings/edit-offerings';
import ViewEnrollment from './pages/enrollment/view-enrollment';
import PrintEnrollment from './pages/prints/print-enrollment';
import RevieweesPayments from './pages/prints/reviewees-payments';
import RevieweesAccounting from './pages/prints/reviewees-accounting';
import ReviewProgramAccounting from './pages/prints/review-program-accounting';
import ReviewProgram from './pages/program/review-program';
import Schools from './pages/schools/schools';
import ViewOfferings from './pages/offerings/view-offerings';
import Receipt from './pages/prints/receipt-accounting';
import RevieweesPopulation from './pages/prints/reviewees-population';
import PaymentPrintList from './pages/prints/payment-print-list';
import ViewReviewPogram from './pages/program/view-review-program';
import ViewSchools from './pages/schools/view-schools';
import StatementOfAccount from './pages/students/statement-of-account';
import PrintOfferings from './pages/prints/print-offerings';
import ExpensesList from './pages/expenses/expenses-list';
import AdminDashboard from './pages/admin/dashboard';
import AdminExpenses from './pages/admin/expenses';
import AdminReporting from './pages/admin/reporting';
import BranchesAdminPage from './pages/admin/branches';

/*
const StudentsPage = withProviders(Students, ['students']);
const PaymentsPage = withProviders(PaymentsList, [
  'payments',
  'courses',
  'programs',
]);
const EnrollmentsPage = withProviders(Enrollment, ['enrollments', 'courses']);
const CoursesPage = withProviders(Courses, ['courses']);
const OfferingsPage = withProviders(Offerings, [
  'offerings',
  'courses',
  'programs',
]);
const AddEnrollmentPage = withProviders(AddEnrollment, [
  'courses',
  'offerings',
]);
const EditEnrollmentPage = withProviders(EditEnrollment, ['offerings']);
const AddOfferingsPage = withProviders(AddOfferings, ['courses']);
const EditOfferingsPage = withProviders(EditOfferings, ['courses']);
const ViewOfferingsPage = withProviders(ViewOfferings, ['courses']);
const ReviewProgramPage = withProviders(ReviewProgram, ['programs']);
const ViewReviewProgramPage = withProviders(ViewReviewPogram, [
  'courses',
  'programs',
]);
const PrintOfferingsPage = withProviders(PrintOfferings, ['offerings']);
const PaymentPrintListPage = withProviders(PaymentPrintList, ['payments']);
*/

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/expenses" element={<AdminExpenses />} />
          <Route path="/admin/reporting" element={<AdminReporting />} />
          <Route path="/admin/branches" element={<BranchesAdminPage />} />
          <Route path="/add-enrollment" element={<AddEnrollment />} />
          <Route
            path="/enrollments/edit-enrollment/:enrollmentId"
            element={<EditEnrollment />}
          />

          <Route path="/enrollments" element={<Enrollment />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:studentId" element={<StudentProfile />} />
          <Route path="/offerings" element={<Offerings />} />
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
            path="/review-program/:programId"
            element={<ViewReviewPogram />}
          />
          <Route path="/schools/:schoolId" element={<ViewSchools />} />
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
          <Route path="/prints/receipt/:paymentId" element={<Receipt />} />
          <Route
            path="/prints/reviewees-population/:Id"
            element={<RevieweesPopulation />}
          />
          <Route path="/prints/payments" element={<PaymentPrintList />} />
          <Route path="/review-program" element={<ReviewProgram />} />
          <Route path="/schools" element={<Schools />} />
          <Route
            path="/students/:studentId/statement-of-account"
            element={<StatementOfAccount />}
          />
          <Route path="/prints/offerings" element={<PrintOfferings />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/" element={<Navigate to="/students" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
