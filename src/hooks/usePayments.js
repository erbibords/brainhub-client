import useSWR from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';

function usePayments(params = {}) {
  // Create a stable key for SWR that includes all parameters
  const swrKey = `payments-${params.pageNo || 1}-${params.pageSize || 200}-${params.referenceNo || ''}-${params.startDate || ''}-${params.endDate || ''}-${params.studentName || ''}-${params.courseId || ''}-${params.schoolId || ''}-${params.semester || ''}-${params.offeringType || ''}-${params.yearOffered || ''}-${params.paymentMethod || ''}-${params.programId || ''}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, async () => {
    let url = PAYMENTS_BASE_URL;
    const queryParams = new URLSearchParams();

    if (params.pageNo) queryParams.append('pageNo', params.pageNo);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.studentName) queryParams.append('studentName', params.studentName);
    if (params.courseId) queryParams.append('courseId', params.courseId);
    if (params.schoolId) queryParams.append('schoolId', params.schoolId);
    if (params.semester) queryParams.append('semester', params.semester);
    if (params.referenceNo) queryParams.append('referenceNo', params.referenceNo);
    if (params.yearOffered) queryParams.append('yearOffered', params.yearOffered);
    if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params.offeringType) queryParams.append('offeringType', params.offeringType);
    if (params.programId) queryParams.append('programId', params.programId);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return fetcher(url);
  });


  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default usePayments;
