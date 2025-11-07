import { useMemo } from 'react';
import useSWR from 'swr';
import { SCHOOLS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useSchools() {
  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
    return SCHOOLS_BASE_URL();
  }, [branchId]);

  const swrKey = useMemo(() => {
    return `schools-${branchId ?? 'unknown'}`;
  }, [branchId]);

  const { data, error, isLoading } = useSWR(swrKey, () => fetcher(requestUrl));
  return {
    data,
    error,
    isLoading,
  };
}

export default useSchools;
