import useSWR from 'swr';
import { PAYMENTS_BASE_URL} from '../constants'
import fetcher from '../utils/fetcher';

function usePayments(params = {}) {
  const {pageNo = 1, pageSize = 25, referenceNo = undefined, startDate = undefined, endDate = undefined, semester = undefined, yearOffered } = params;

  let url = PAYMENTS_BASE_URL;
  
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (semester) queryParams.append('semester', semester);
  if (referenceNo) queryParams.append('referenceNo', referenceNo);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error, isLoading } = useSWR('payments', () => fetcher(url));
  
  return {
     data,
     error,
    isLoading,
  };
}

export default usePayments;
