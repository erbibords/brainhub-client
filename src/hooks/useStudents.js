import { useMemo } from 'react';
import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useStudents(params = {}) {
  const {
    studentName = undefined,
    schoolId = undefined,
    pageNo = 1,
    pageSize = 200, 
    offeringType = undefined,
  } = params;

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

  const swrKey = useMemo(() => {
    return `students-${branchId ?? 'unknown'}-${JSON.stringify(params)}`;
  }, [branchId, params]);

  const { data, error, mutate, isLoading } = useSWR(swrKey, () =>
    fetcher(requestUrl)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useStudents;
