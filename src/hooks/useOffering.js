import useSWR from 'swr';
import { OFFERING_BASE_URL } from '../constants';

function useOffering(offeringId) {
  const { data, error } = useSWR(`${OFFERING_BASE_URL}/${offeringId}?includeEnrollment=true`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useOffering;
