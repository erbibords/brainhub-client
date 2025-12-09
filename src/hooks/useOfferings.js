import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useOfferings(params = {}) {
  // Normalize params - if null, use empty object to avoid destructuring errors
  const normalizedParams = params === null ? {} : params;
  const {
    pageNo = 1,
    pageSize = 25,
    courseId = undefined,
    reviewProgramName = undefined,
    yearOffered = undefined,
    semester = undefined,
    offeringType = undefined,
  } = normalizedParams;

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

  // If params is null, disable fetching by passing null as SWR key
  const swrKey = useMemo(() => {
    if (params === null) return null;
    return `offerings-${branchId ?? 'unknown'}-${JSON.stringify(normalizedParams)}`;
  }, [branchId, normalizedParams, params]);

  const { data, error, isLoading } = useSWR(swrKey, swrKey ? () => fetcher(requestUrl) : null);

  return {
    data,
    error,
    isLoading,
  };
}

export default useOfferings;
