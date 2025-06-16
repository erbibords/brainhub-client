import useSWR from 'swr';
import { COURSE_BASE_URL } from '../constants';
import fetcher from '../utils/fetcher';

function useCourses(params = {}) {
  const { name = undefined, pageNo = 1, pageSize = 10000 } = params;

  let url = COURSE_BASE_URL;
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('name', name);
  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR("courses", () => fetcher(url));

  const isLoading = !data && !error;

  return {
    courses: data,
    error,
    isLoading,
  };
}

export default useCourses;