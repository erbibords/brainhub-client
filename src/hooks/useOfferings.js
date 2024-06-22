import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'

function useOfferings(params = {}) {
  const {pageNo = 1, pageSize = 25, courseId, program, yearOffered, semester } = params;

  let url = `branches/${DEFAULT_BRANCH_ID}/offerings`;

  if(courseId) {
     url = `branches/${DEFAULT_BRANCH_ID}/courses/${courseId}/offerings`;
  }

  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (program) queryParams.append('program', program);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);
  if (semester) queryParams.append('semester', semester);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR(url);
  const isLoading = !data && !error;

  return {
     data,
    error,
    isLoading,
  };
}

export default useOfferings;
