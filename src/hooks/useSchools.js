import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';

function useSchools() {
  const { data, error } = useSWR(`branches/${DEFAULT_BRANCH_ID}/schools`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useSchools;
