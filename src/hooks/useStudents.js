import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useStudents(params = {}) {
  // Normalize params - if null, use empty object to avoid destructuring errors
  const normalizedParams = params === null ? {} : params;
  const {
    studentName = undefined,
    schoolId = undefined,
    pageNo = 1,
    pageSize = 100, // Default to 100
    offeringType = undefined,
  } = normalizedParams;

  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
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
  }, [pageNo, pageSize, schoolId, studentName, offeringType, branchId]);

  // If params is null, disable fetching by passing null as SWR key
  const swrKey = useMemo(() => {
    if (params === null) return null;
    return `students-${branchId ?? 'unknown'}-${JSON.stringify(normalizedParams)}`;
  }, [branchId, normalizedParams, params]);

  const { data, error, mutate, isLoading } = useSWR(swrKey, swrKey ? () =>
    fetcher(requestUrl)
  : null);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useStudents;
