import useSWR from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';
import { useEffect } from 'react';

function usePayments(params = {}) {
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
    programId = undefined
  } = params;

  let url = PAYMENTS_BASE_URL;

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

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  // Create a unique key for SWR that includes all parameters
  const swrKey = `payments-${JSON.stringify(params)}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, () =>
    fetcher(url)
  );

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default usePayments;
