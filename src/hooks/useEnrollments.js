import useSWR from 'swr';
import { DEFAULT_BRANCH_ID} from '../constants'

function useEnrollments( params = {}) {
  const { pageNo = 1, pageSize = 25, courseOfferingid = undefined, semester = undefined, schoolId = undefined, yearOffered = undefined } = params;
  
  let url = `branches/${DEFAULT_BRANCH_ID}/enrollments`;
  const queryParams = new URLSearchParams();

  if (pageNo) queryParams.append('pageNo', pageNo);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (courseOfferingid) queryParams.append('courseOfferingid', courseOfferingid);
  if (semester) queryParams.append('semester', semester);
  if (schoolId) queryParams.append('schoolId', schoolId);
  if (yearOffered) queryParams.append('yearOffered', yearOffered);
   queryParams.append('includeStudent', 'true');
   queryParams.append('includeCourseOffering', 'true');


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

export default useEnrollments;
