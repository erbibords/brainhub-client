import { useMemo } from 'react';
import useSWR from 'swr';
import { EXPENSE_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function useExpenses(params = {}) {
  const {
    pageNo = 1,
    pageSize = 200,
    name = undefined,
    type = undefined,
    entityId = undefined,
    dateFrom = undefined,
    dateTo = undefined,
    minAmount = undefined,
    maxAmount = undefined,
  } = params;

  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
    let url = EXPENSE_BASE_URL();
    const queryParams = new URLSearchParams();

    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (name) queryParams.append('name', name);
    if (type) queryParams.append('type', type);
    if (entityId) queryParams.append('entityId', entityId);
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);
    if (minAmount) queryParams.append('minAmount', minAmount);
    if (maxAmount) queryParams.append('maxAmount', maxAmount);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }, [
    pageNo,
    pageSize,
    name,
    type,
    entityId,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
    branchId,
  ]);

  const swrKey = useMemo(() => {
    return `expenses-${branchId ?? 'unknown'}-${JSON.stringify(params)}`;
  }, [branchId, params]);

  const { data, error, isLoading, mutate } = useSWR(swrKey, () => fetcher(requestUrl));

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useExpenses;
