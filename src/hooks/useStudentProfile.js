import useSWR, { mutate } from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';

function useProfile(id) {
  const url =  `branches/${DEFAULT_BRANCH_ID()}/students/${id}`
  const { data, error, isLoading } = useSWR(url);

  return {
    data,
    error,
    isLoading,
    refetch: () => {
      if (id) {
        mutate(url);
      }
    },
  };
}

export default useProfile;
