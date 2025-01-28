import useSWR, { mutate } from 'swr';
import { OFFERING_BASE_URL } from '../constants';

function useOffering(offeringId) {

  const { data, error } = useSWR(!!offeringId ? `${OFFERING_BASE_URL}/${offeringId}?includeEnrollment=true` : null);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    refetch: () => {
      if (offeringId) {
        mutate(`${OFFERING_BASE_URL}/${offeringId}?includeEnrollment=true`);
      }
    },
  };
}

export default useOffering;
