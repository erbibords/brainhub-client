import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';

function useProfile(id) {
  const { data, error, isLoading } = useSWR(
    `branches/${DEFAULT_BRANCH_ID()}/students/${id}`
  );

  return {
    data,
    error,
    isLoading,
  };
}

export default useProfile;
