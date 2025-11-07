import { useMemo } from 'react';
import useSWR from 'swr';
import { REVIEW_PROGRAM_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function usePrograms(params = {}) {
  const { name = undefined, pageNo = 1, pageSize = 10000 } = params;

  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
    let url = REVIEW_PROGRAM_BASE_URL();
    const queryParams = new URLSearchParams();

    if (name) queryParams.append('name', name);
    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }, [name, pageNo, pageSize, branchId]);

  const swrKey = useMemo(() => {
    return `programs-${branchId ?? 'unknown'}-${JSON.stringify(params)}`;
  }, [branchId, params]);

  const { data, error } = useSWR(swrKey, () => fetcher(requestUrl));

  const isLoading = !data && !error;

  return {
    programs: data,
    error,
    isLoading,
  };
}

export default usePrograms;
