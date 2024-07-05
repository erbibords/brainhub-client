import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Sidebar from "../SideBar/Sidebar";
import { AuthProvider } from "../../contexts/auth";
import { StudentProvider } from "../../contexts/students";
import { CoursesProvider } from "../../contexts/courses";
import { OfferingsProvider } from "../../contexts/offerings";
import { EnrollmentsProvider } from "../../contexts/enrollments";
import { ProgramsProvider } from "../../contexts/programs";
import { PaymentsProvider } from "../../contexts/payments";

const MainLayout = ({ children, showSidebar = true }) => {
  const location = useLocation();
  const isPrintPage = location.pathname.startsWith("/prints/");
  const isLoginPage = location.pathname === "/login";

  return (
    <AuthProvider>
      <ProgramsProvider>
        <EnrollmentsProvider>
          <StudentProvider>
            <CoursesProvider>
              <OfferingsProvider>
                <PaymentsProvider>
                  <div className="flex min-h-screen">
                    {!isPrintPage && (
                      <>
                        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow">
                          <Navbar currentRoute={location.pathname} />
                        </header>
                        {!isLoginPage && showSidebar && (
                          <aside className="fixed top-16 left-0 bottom-0 z-40 w-52 bg-gray-100 shadow">
                            <Sidebar />
                          </aside>
                        )}
                      </>
                    )}
                    <main
                      className={`flex-1 p-6 ${
                        isPrintPage || isLoginPage ? "" : "pt-24 ml-52"
                      }`}
                    >
                      {children}
                    </main>
                  </div>
                </PaymentsProvider>
              </OfferingsProvider>
            </CoursesProvider>
          </StudentProvider>
        </EnrollmentsProvider>
      </ProgramsProvider>
    </AuthProvider>
  );
};

export default MainLayout;
