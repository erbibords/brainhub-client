import { useMemo } from 'react';
import useSWR from 'swr';
import { AUDIT_LOGS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';

function useAuditLogs(params = {}) {
  const normalizedParams = params === null ? {} : params;
  const {
    pageNo = 1,
    pageSize = 25,
    action = undefined,
    entityType = undefined,
    entityId = undefined,
    actorUserId = undefined,
    search = undefined,
    startDate = undefined,
    endDate = undefined,
  } = normalizedParams;

  const requestUrl = useMemo(() => {
    let url = AUDIT_LOGS_BASE_URL();
    const queryParams = new URLSearchParams();

    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (action) queryParams.append('action', action);
    if (entityType) queryParams.append('entityType', entityType);
    if (entityId) queryParams.append('entityId', entityId);
    if (actorUserId) queryParams.append('actorUserId', actorUserId);
    if (search) queryParams.append('search', search);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return url;
  }, [
    pageNo,
    pageSize,
    action,
    entityType,
    entityId,
    actorUserId,
    search,
    startDate,
    endDate,
  ]);

  const swrKey = useMemo(() => {
    if (params === null) return null;
    return requestUrl;
  }, [params, requestUrl]);

  const { data, error, isLoading } = useSWR(
    swrKey,
    swrKey ? () => fetcher(requestUrl) : null
  );

  return {
    data,
    error,
    isLoading,
  };
}

export default useAuditLogs;
