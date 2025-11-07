import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

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

  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
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
    queryParams.append('includeEnrollment', 'true');

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return url;
  }, [
    pageNo,
    pageSize,
    reviewProgramName,
    yearOffered,
    semester,
    courseId,
    offeringType,
    branchId,
  ]);

  const swrKey = useMemo(() => {
    return `offerings-${branchId ?? 'unknown'}-${JSON.stringify(params)}`;
  }, [branchId, params]);

  const { data, error, isLoading } = useSWR(swrKey, () => fetcher(requestUrl));

  return {
    data,
    error,
    isLoading,
  };
}

export default useOfferings;
