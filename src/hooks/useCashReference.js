import { useMemo } from 'react';
import useSWR from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function useCashReference() {
  const { branchId } = useBranch();

  const resourceUrl = branchId ? `${PAYMENTS_BASE_URL()}/cash-reference` : null;

  const { data, error, isLoading } = useSWR(resourceUrl);

  return {
    data,
    error,
    isLoading,
  };
}

export default useCashReference;
