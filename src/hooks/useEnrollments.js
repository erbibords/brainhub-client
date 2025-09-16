import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useEffect } from 'react';

function useEnrollments(params = {}) {
  const {
    pageNo = 1,
    pageSize = 3500, // Changed from 10000 to 200 for better performance
    courseId = undefined,
    studentName = undefined,
    semester = undefined,
    schoolId = undefined,
    startDate = undefined,
    endDate = undefined,
    yearOffered = undefined,
    offeringType = undefined,
    programId = undefined,
  } = params;

  let url = `branches/${DEFAULT_BRANCH_ID()}/enrollments`;
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (courseId) queryParams.append('courseId', courseId);
  if (studentName) queryParams.append('studentName', studentName);
  if (semester) queryParams.append('semester', semester);
  if (schoolId) queryParams.append('schoolId', schoolId);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (offeringType) queryParams.append('offeringType', offeringType);
  if (programId) queryParams.append('programId', programId);

  queryParams.append('includeStudent', 'true');
  queryParams.append('includeCourseOffering', 'true');

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  // Create a unique key for SWR that includes all parameters
  const swrKey = `enrollments-${JSON.stringify(params)}`;

  const { data, mutate, error } = useSWR(swrKey, () => fetcher(url));
  const isLoading = !data && !error;

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useEnrollments;
