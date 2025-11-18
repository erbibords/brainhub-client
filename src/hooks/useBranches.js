import useSWR from 'swr';
import fetcher from '../utils/fetcher';

function useBranches() {
  const { data, error, isLoading, mutate } = useSWR('admin-branches', () =>
    fetcher('branches')
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useBranches;

