import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'

function useStudents(params = {}) {
  const { studentName = undefined, school = undefined, pageNo = 1, pageSize = 25 } = params;
  
  let url = `branches/${DEFAULT_BRANCH_ID}/students`;
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (school) queryParams.append('school', school);
  if (studentName) queryParams.append('studentName', studentName);

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

export default useStudents;
