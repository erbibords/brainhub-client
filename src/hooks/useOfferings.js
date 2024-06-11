import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'

function useOfferings(courseId, params = {}) {
  if(!courseId) return;
  const {pageNo = 1, pageSize = 25 } = params;
  
  let url = `branches/${DEFAULT_BRANCH_ID}/courses/${courseId}/offerings`;
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR(url);
  const isLoading = !data && !error;

  return {
    offerings: data,
    error,
    isLoading,
  };
}

export default useOfferings;
