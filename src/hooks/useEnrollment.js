import useSWR from 'swr';
import { ENROLLMENT_BASE_URL } from '../constants';

function useEnrollment(enrollmentId) {
  const { data, error } = useSWR(`${ENROLLMENT_BASE_URL}/${enrollmentId}`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useEnrollment;
