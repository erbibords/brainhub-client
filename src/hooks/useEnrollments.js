import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useEnrollments(params = {}) {
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

    queryParams.append('includeStudent', 'true');
    queryParams.append('includeCourseOffering', 'true');

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
    branchId,
  ]);

  const swrKey = useMemo(() => {
    return `enrollments-${branchId ?? 'unknown'}-${JSON.stringify(params)}`;
  }, [branchId, params]);

  const { data, mutate, error } = useSWR(swrKey, () => fetcher(requestUrl));
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useEnrollments;
