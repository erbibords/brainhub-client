import { useMemo } from 'react';
import useSWR from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useBranch } from '../contexts/branch';

function usePayments(params = {}) {
  // Normalize params - if null, use empty object to avoid destructuring errors
  const normalizedParams = params === null ? {} : params;
  const {
    pageNo = 1,
    pageSize = 200, 
    referenceNo = undefined,
    startDate = undefined,
    endDate = undefined,
    studentName = undefined,
    courseId = undefined,
    schoolId = undefined,
    semester = undefined,
    offeringType = undefined,
    yearOffered,
    paymentMethod = undefined,
    programId = undefined,
    deleted = undefined
  } = normalizedParams;
 
  const { branchId } = useBranch();

  const requestUrl = useMemo(() => {
    let url = PAYMENTS_BASE_URL();

    const queryParams = new URLSearchParams();

    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (studentName) queryParams.append('studentName', studentName);
    if (courseId) queryParams.append('courseId', courseId);
    if (schoolId) queryParams.append('schoolId', schoolId);
    if (semester) queryParams.append('semester', semester);
    if (referenceNo) queryParams.append('referenceNo', referenceNo);
    if (yearOffered) queryParams.append('yearOffered', yearOffered);
    if (paymentMethod) queryParams.append('paymentMethod', paymentMethod);
    if (offeringType) queryParams.append('offeringType', offeringType);
    if (programId) queryParams.append('programId', programId);
    if (deleted !== undefined) queryParams.append('deleted', deleted);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }, [
    pageNo,
    pageSize,
    startDate,
    endDate,
    studentName,
    courseId,
    schoolId,
    semester,
    referenceNo,
    yearOffered,
    paymentMethod,
    offeringType,
    programId,
    deleted,
    branchId,
  ]);

  // If params is null, disable fetching by passing null as SWR key
  const swrKey = useMemo(() => {
    if (params === null) return null;
    return `payments-${branchId ?? 'unknown'}-${JSON.stringify(normalizedParams)}`;
  }, [branchId, normalizedParams, params]);

  const { data, error, isLoading, mutate } = useSWR(swrKey, swrKey ? () =>
    fetcher(requestUrl)
  : null);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default usePayments;
