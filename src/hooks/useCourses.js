import useSWR from 'swr';
import {  GET_COURSE_URL} from '../constants'

function useCourses(params = {}) {
  const { name = undefined,  pageNo = 1, pageSize = 25 } = params;
  
  let url = GET_COURSE_URL;
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('name', name);
  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR(url);

  const isLoading = !data && !error;

  return {
    courses: data,
    error,
    isLoading,
  };
}

export default useCourses;
