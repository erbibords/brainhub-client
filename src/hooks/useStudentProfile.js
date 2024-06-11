import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';

function useProfile(id) {
  const { data, error } = useSWR(`branches/${DEFAULT_BRANCH_ID}/students/${id}`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useProfile;
