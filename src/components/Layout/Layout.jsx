import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Sidebar from "../SideBar/Sidebar";
import { AuthProvider } from "../../contexts/auth";
import { StudentProvider } from "../../contexts/students";
import { CoursesProvider } from "../../contexts/courses";
import { OfferingsProvider } from "../../contexts/offerings";
import { EnrollmentsProvider } from "../../contexts/enrollments";

const MainLayout = ({ children, showSidebar = true }) => {
  const location = useLocation();
  const isPrintPage = location.pathname.startsWith('/prints/');

  return (
    <AuthProvider>
      <EnrollmentsProvider>
        <StudentProvider>
          <CoursesProvider>
            <OfferingsProvider>
              <div className="flex min-h-screen">
                {!isPrintPage && (
                  <>
                    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow">
                      <Navbar currentRoute={location.pathname} />
                    </header>
                    {showSidebar && (
                      <aside className="fixed top-16 left-0 bottom-0 z-40 w-52 bg-gray-100 shadow">
                        <Sidebar />
                      </aside>
                    )}
                  </>
                )}
                <main className={`flex-1 p-6 ${isPrintPage ? '' : 'pt-24 ml-52'}`}>{children}</main>
              </div>
            </OfferingsProvider>
          </CoursesProvider>
      </StudentProvider>
      </EnrollmentsProvider>
    </AuthProvider>
  );
};

export default MainLayout;
