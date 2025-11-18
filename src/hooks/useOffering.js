import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { OFFERING_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function useOffering(offeringId) {
  const { branchId } = useBranch();

  const resourceUrl = useMemo(() => {
    if (!offeringId) {
      return null;
    }

    return `${OFFERING_BASE_URL()}/${offeringId}?includeEnrollment=true`;
  }, [branchId, offeringId]);

  const { data, error } = useSWR(resourceUrl);
  const isLoading = !data && !error;

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

export default useOffering;
