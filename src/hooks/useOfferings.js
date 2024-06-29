import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'
import fetcher from '../utils/fetcher';

function useOfferings(params = {}) {
  const {pageNo = 1, pageSize = 25, courseId, program, yearOffered, semester } = params;

  let url = `branches/${DEFAULT_BRANCH_ID}/offerings`;
  
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (program) queryParams.append('program', program);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);
  if (semester) queryParams.append('semester', semester);
  if (courseId) queryParams.append('courseId', courseId);


  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR('offerings', () => fetcher(url));
  const isLoading = !data && !error;

  return {
     data,
    error,
    isLoading,
  };
}

export default useOfferings;
