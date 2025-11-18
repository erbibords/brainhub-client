import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import { useBranch } from '../contexts/branch';

function useProfile(id) {
  const { branchId } = useBranch();

  const resourceUrl = useMemo(() => {
    if (!id) {
      return null;
    }

    return `branches/${DEFAULT_BRANCH_ID()}/students/${id}`;
  }, [branchId, id]);

  const { data, error, isLoading } = useSWR(resourceUrl);

  const refetch = useCallback(() => {
    if (resourceUrl) {
      mutate(resourceUrl);
    }
  }, [resourceUrl]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export default useProfile;
