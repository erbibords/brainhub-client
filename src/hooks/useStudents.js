import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useEffect } from 'react';

function useStudents(params = {}) {
  const {
    studentName = undefined,
    schoolId = undefined,
    pageNo = 1,
    pageSize = 5000, 
    offeringType = undefined,
  } = params;

  const generateUrl = () => {
    let url = `branches/${DEFAULT_BRANCH_ID()}/students`;
    const queryParams = new URLSearchParams();

    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (schoolId) queryParams.append('schoolId', schoolId);
    if (studentName) queryParams.append('studentName', studentName);
    if (offeringType) queryParams.append('offeringType', offeringType);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  };

  // Create a stable key for SWR that includes all parameters
  const swrKey = `students-${pageNo}-${pageSize}-${studentName || ''}-${schoolId || ''}-${offeringType || ''}`;

  const { data, error, mutate, isLoading } = useSWR(swrKey, () =>
    fetcher(generateUrl())
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useStudents;
