import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useEffect } from 'react';

function useOfferings(params = {}) {
  const {
    pageNo = 1,
    pageSize = 25,
    courseId = undefined,
    reviewProgramName = undefined,
    yearOffered = undefined,
    semester = undefined,
    offeringType = undefined,
  } = params;

  const generateUrl = () => {
    let url = `branches/${DEFAULT_BRANCH_ID()}/offerings`;

    const queryParams = new URLSearchParams();

    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (reviewProgramName)
      queryParams.append('reviewProgramName', reviewProgramName);
    if (yearOffered) queryParams.append('yearOffered', yearOffered);
    if (semester) queryParams.append('semester', semester);
    if (courseId) queryParams.append('courseId', courseId);
    if (offeringType) queryParams.append('offeringType', offeringType);
    queryParams.append('includeEnrollment', true);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return url;
  };

  // Create a stable key for SWR that includes all parameters
  const swrKey = `offerings-${pageNo}-${pageSize}-${courseId || ''}-${reviewProgramName || ''}-${yearOffered || ''}-${semester || ''}-${offeringType || ''}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, () =>
    fetcher(generateUrl())
  );

  return {
    data,
    error,
    isLoading,
  };
}

export default useOfferings;
