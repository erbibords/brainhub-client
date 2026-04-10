import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useEnrollments(params = {}) {
  // Normalize params - if null, use empty object to avoid destructuring errors
  const normalizedParams = params === null ? {} : params;
  const {
    pageNo = 1,
    pageSize = 200, // Changed from 10000 to 200 for better performance
    courseId = undefined,
    studentName = undefined,
    semester = undefined,
    schoolId = undefined,
    startDate = undefined,
    endDate = undefined,
    yearOffered = undefined,
    offeringType = undefined,
    programId = undefined,
    includeStudent = true,
    includeCourseOffering = true,
  } = normalizedParams;
  
  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
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

    if (includeStudent) queryParams.append('includeStudent', 'true');
    if (includeCourseOffering) {
      queryParams.append('includeCourseOffering', 'true');
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }, [
    pageNo,
    pageSize,
    courseId,
    studentName,
    semester,
    schoolId,
    startDate,
    endDate,
    yearOffered,
    offeringType,
    programId,
    includeStudent,
    includeCourseOffering,
    branchId,
  ]);

  // If params is null, disable fetching by passing null as SWR key
  const swrKey = useMemo(() => {
    if (params === null) return null;
    return requestUrl;
  }, [params, requestUrl]);

  const { data, mutate, error } = useSWR(swrKey, swrKey ? () => fetcher(requestUrl) : null);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useEnrollments;
