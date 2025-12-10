import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Sidebar from '../SideBar/Sidebar';
import { BranchProvider, useBranch } from '../../contexts/branch';
import { AuthProvider, useAuth } from '../../contexts/auth';

import { StudentProvider } from '../../contexts/students';
import { OfferingsProvider } from '../../contexts/offerings';
import { EnrollmentsProvider } from '../../contexts/enrollments';
import { PaymentsProvider } from '../../contexts/payments';

const BranchScopedProviders = ({ children }) => (
  <EnrollmentsProvider>
    <StudentProvider>
      <OfferingsProvider>
        <PaymentsProvider>{children}</PaymentsProvider>
      </OfferingsProvider>
    </StudentProvider>
  </EnrollmentsProvider>
);

const LayoutShell = ({ children, showSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isBootstrapping } = useAuth();
  const { isEmulating } = useBranch();

  const isPrintPage = location.pathname.startsWith('/prints/');
  const isLoginPage = location.pathname === '/login';
  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  const shouldUseBranchProviders = !isSuperAdmin || isEmulating;

  useEffect(() => {
    if (!isSuperAdmin || isBootstrapping) {
      return;
    }

    const isAdminRoute =
      location.pathname.startsWith('/admin') || location.pathname === '/login';

    if (!isEmulating && !isAdminRoute) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isBootstrapping, isEmulating, isSuperAdmin, location.pathname, navigate]);

  const content = useMemo(() => {
    if (!shouldUseBranchProviders) {
      return children;
    }

    return <BranchScopedProviders>{children}</BranchScopedProviders>;
  }, [children, shouldUseBranchProviders]);

  const shouldShowSidebar =
    !isPrintPage && !isLoginPage && showSidebar && !isBootstrapping;

  const mainClasses = useMemo(() => {
    const classes = ['flex-1', 'p-6', 'overflow-x-auto'];

    if (!isPrintPage && !isLoginPage) {
      classes.push('pt-24');
      if (shouldShowSidebar) {
        classes.push('ml-52');
      }
    }

    return classes.join(' ');
  }, [isLoginPage, isPrintPage, shouldShowSidebar]);

  return (
    <div className="flex min-h-screen">
      {!isPrintPage && (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow">
            <Navbar currentRoute={location.pathname} />
          </header>
          {shouldShowSidebar && (
            <aside className="fixed top-16 left-0 bottom-0 z-40 w-52 bg-gray-100 shadow">
              <Sidebar />
            </aside>
          )}
        </>
      )}
      <main className={mainClasses}>{content}</main>
    </div>
  );
};

const MainLayout = ({ children, showSidebar = true }) => (
  <BranchProvider>
    <AuthProvider>
      <LayoutShell showSidebar={showSidebar}>{children}</LayoutShell>
    </AuthProvider>
  </BranchProvider>
);

export default MainLayout;
