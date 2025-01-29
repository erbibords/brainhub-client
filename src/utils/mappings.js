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

export const formatSemesterForOffering = (semester) => {
  if (semester === 'FIRST_SEMESTER') return '1ST_SEM';
  if (semester === 'SECOND_SEMESTER') return '2ND_SEM';
  if (semester === 'SUMMER') return semester;
  return semester?.substring(0, 3) ?? semester;
};
export const getCourseOfferingName = (courseOffering) => {
  if (!courseOffering) return '';
  return `(${courseOffering?.course?.name ?? ''}) ${
    courseOffering?.reviewProgram?.name ?? ''
  } sy:${courseOffering?.yearOffered ?? ''}-${
    formatSemesterForOffering(courseOffering?.semester) ?? ''
  }`;
};

export const getPaymentById = (payments, id) => {
  if (!payments || !id) return null;
  return payments?.find((payment) => payment.id === id);
};

export const getDataById = (data, id) => {
  if (!data || !id) return null;
  return data?.find((d) => d.id === id);
};

export const getLatestData = (data) =>
  data.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  }, data[0]);

export const getStudentRemainingBalance = (data) => {
  if (!data) 0;
  return data.reduce((acc, item) => acc + item.remainingBalance, 0);
};
