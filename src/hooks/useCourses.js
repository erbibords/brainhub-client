import useSWR from 'swr';
import { useMemo } from 'react';
import { COURSE_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useCourses(params = {}) {
  // Normalize params - if null, use empty object to avoid destructuring errors
  const normalizedParams = params === null ? {} : params;
  const { name = undefined, pageNo = 1, pageSize = 200 } = normalizedParams;

  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
    let url = COURSE_BASE_URL();
    const queryParams = new URLSearchParams();

    if (name) queryParams.append('name', name);
    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }, [name, pageNo, pageSize, branchId]);

  // If params is null, disable fetching by passing null as SWR key
  const swrKey = useMemo(() => {
    if (params === null) return null;
    return `courses-${branchId ?? 'unknown'}-${JSON.stringify(normalizedParams)}`;
  }, [branchId, normalizedParams, params]);

  const { data, error } = useSWR(swrKey, swrKey ? () => fetcher(requestUrl) : null);

  const isLoading = !data && !error;

  return {
    courses: data,
    error,
    isLoading,
  };
}

export default useCourses;