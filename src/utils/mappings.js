export const getSchoolById = (schools, id) => {
  if (!schools || !id) return null;
  return schools?.find((school) => school.id === id);
};

export const getCourseById = (courses, id) => {
  if (!courses || !id) return null;
  return courses?.find((course) => course.id === id) ?? [];
};

export const getFullName = (studentData) => {
  if (!studentData) return '';
  const { firstName, middleName, lastName } = studentData;
  return `${firstName} ${middleName} ${lastName}`;
};

export const getCourseOfferingName = (courseOffering) => {
  return `${courseOffering?.course?.name ?? ''}-${
    courseOffering?.reviewProgram?.name ?? ''
  }-${courseOffering?.yearOffered ?? ''}-${courseOffering?.semester ?? ''}`;
};

export const getPaymentById = (payments, id) => {
  if (!payments || !id) return null;
  return payments?.find((payment) => payment.id === id);
}
