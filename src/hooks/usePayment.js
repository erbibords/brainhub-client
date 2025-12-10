import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function usePayment(paymentId) {
  const { branchId } = useBranch();

  const resourceUrl = useMemo(() => {
    if (!paymentId) {
      return null;
    }

    return `${PAYMENTS_BASE_URL()}/${paymentId}`;
  }, [branchId, paymentId]);

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

export default usePayment;

