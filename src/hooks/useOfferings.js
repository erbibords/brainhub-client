import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'
import fetcher from '../utils/fetcher';
import { useEffect } from 'react';

function useOfferings(params = {}) {
  const {pageNo = 1, pageSize = 25, courseId = undefined, reviewProgramName = undefined, yearOffered = undefined, semester = undefined } = params;

  const generateUrl = () => {
    let url = `branches/${DEFAULT_BRANCH_ID}/offerings`;
  
    const queryParams = new URLSearchParams();
  
    if (pageNo) queryParams.append('pageNo', pageNo);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (reviewProgramName) queryParams.append('reviewProgramName', reviewProgramName);
    if (yearOffered) queryParams.append('yearOffered', yearOffered);
    if (semester) queryParams.append('semester', semester);
    if (courseId) queryParams.append('courseId', courseId);
    queryParams.append('includeEnrollment', true);

  
  
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return url;
  }

  const { data, error, isLoading, mutate } = useSWR('offerings', () => fetcher(generateUrl()));

  useEffect(() => {
    mutate();
  }, [params]);

  return {
     data,
    error,
    isLoading,
  };
}

export default useOfferings;