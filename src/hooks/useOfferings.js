import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'

function useOfferings(courseId, params = {}) {
  if(!courseId) return;
<<<<<<< HEAD
  const {pageNo = 1, pageSize = 25 } = params;
=======
  const {pageNo = 1, pageSize = 25, program, yearOffered, semester } = params;
>>>>>>> master
  
  let url = `branches/${DEFAULT_BRANCH_ID}/courses/${courseId}/offerings`;
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
<<<<<<< HEAD
=======
  if (program) queryParams.append('program', program);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);
  if (semester) queryParams.append('semester', semester);
>>>>>>> master

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR(url);
  const isLoading = !data && !error;

  return {
<<<<<<< HEAD
    offerings: data,
=======
     data,
>>>>>>> master
    error,
    isLoading,
  };
}

export default useOfferings;
