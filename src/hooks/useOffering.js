import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { OFFERING_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function useOffering(offeringId, options = {}) {
  const { includeEnrollment = false } = options;
  const { branchId } = useBranch();

  const resourceUrl = useMemo(() => {
    if (!offeringId) {
      return null;
    }

    const includeEnrollmentQuery = includeEnrollment
      ? '?includeEnrollment=true'
      : '';
    return `${OFFERING_BASE_URL()}/${offeringId}${includeEnrollmentQuery}`;
  }, [branchId, offeringId, includeEnrollment]);

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
