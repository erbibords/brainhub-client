import useSWR from 'swr';
import fetcher from '../utils/fetcher';

const VALID_RANGES = ['7d', '15d', '1m', '1y'];

function useAdminAnalytics(range = '7d') {
  const safeRange = VALID_RANGES.includes(range) ? range : '7d';
  const { data, error, isLoading, mutate } = useSWR(
    ['admin-analytics', safeRange],
    () => fetcher(`admin/analytics?range=${safeRange}`)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useAdminAnalytics;






