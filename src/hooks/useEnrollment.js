import { useMemo } from 'react';
import useSWR from 'swr';
import { ENROLLMENT_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function useEnrollment(enrollmentId) {
  const { branchId } = useBranch();

  const resourceKey = useMemo(() => {
    if (!enrollmentId) {
      return null;
    }

    return `${ENROLLMENT_BASE_URL()}/${enrollmentId}`;
  }, [branchId, enrollmentId]);

  const { data, error } = useSWR(resourceKey);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useEnrollment;
