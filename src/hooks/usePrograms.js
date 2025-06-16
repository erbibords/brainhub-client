import useSWR from 'swr';
import { REVIEW_PROGRAM_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';

function usePrograms(params = {}) {
  const { name = undefined, pageNo = 1, pageSize = 10000 } = params;

  let url = REVIEW_PROGRAM_BASE_URL;
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('name', name);
  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR("programs", () => fetcher(url));

  const isLoading = !data && !error;

  return {
    programs: data,
    error,
    isLoading,
  };
}

export default usePrograms;
