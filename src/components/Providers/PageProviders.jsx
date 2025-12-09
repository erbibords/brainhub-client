/**
 * Page-specific providers for lazy loading
 * Only loads data when a specific page needs it
 */

import { StudentProvider } from '../../contexts/students';
import { CoursesProvider } from '../../contexts/courses';
import { OfferingsProvider } from '../../contexts/offerings';
import { EnrollmentsProvider } from '../../contexts/enrollments';
import { ProgramsProvider } from '../../contexts/programs';
import { PaymentsProvider } from '../../contexts/payments';

/**
 * Wrapper for pages that need Students data
 */
export const withStudentsProvider = (Component) => {
  return (props) => (
    <StudentProvider>
      <Component {...props} />
    </StudentProvider>
  );
};

/**
 * Wrapper for pages that need Payments data
 */
export const withPaymentsProvider = (Component) => {
  return (props) => (
    <PaymentsProvider>
      <Component {...props} />
    </PaymentsProvider>
  );
};

/**
 * Wrapper for pages that need Enrollments data
 */
export const withEnrollmentsProvider = (Component) => {
  return (props) => (
    <EnrollmentsProvider>
      <Component {...props} />
    </EnrollmentsProvider>
  );
};

/**
 * Wrapper for pages that need Courses data
 */
export const withCoursesProvider = (Component) => {
  return (props) => (
    <CoursesProvider>
      <Component {...props} />
    </CoursesProvider>
  );
};

/**
 * Wrapper for pages that need Offerings data
 */
export const withOfferingsProvider = (Component) => {
  return (props) => (
    <OfferingsProvider>
      <Component {...props} />
    </OfferingsProvider>
  );
};

/**
 * Wrapper for pages that need Programs data
 */
export const withProgramsProvider = (Component) => {
  return (props) => (
    <ProgramsProvider>
      <Component {...props} />
    </ProgramsProvider>
  );
};

/**
 * Wrapper for pages that need multiple providers
 * Usage: withProviders(Component, ['students', 'courses', 'payments'])
 */
export const withProviders = (Component, providerNames = []) => {
  let WrappedComponent = Component;

  // Apply providers in reverse order (inner to outer)
  const providerMap = {
    students: StudentProvider,
    courses: CoursesProvider,
    offerings: OfferingsProvider,
    enrollments: EnrollmentsProvider,
    programs: ProgramsProvider,
    payments: PaymentsProvider,
  };

  providerNames.reverse().forEach((name) => {
    const Provider = providerMap[name];
    if (Provider) {
      const PreviousComponent = WrappedComponent;
      WrappedComponent = (props) => (
        <Provider>
          <PreviousComponent {...props} />
        </Provider>
      );
    }
  });

  return WrappedComponent;
};
