import useSWR from 'swr';
import { SCHOOLS_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';

function useSchools() {
  const { data, error, isLoading } = useSWR('schools', () => fetcher(SCHOOLS_BASE_URL));
  return {
    data,
    error,
    isLoading,
  };
}

export default useSchools;
