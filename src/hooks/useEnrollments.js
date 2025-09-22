import useSWR from 'swr';
import { DEFAULT_BRANCH_ID } from '../constants';
import fetcher from '../utils/fetcher';

function useEnrollments(params = {}) {
  // Create a stable key for SWR that includes all parameters
  const swrKey = `enrollments-${params.pageNo || 1}-${params.pageSize || 4500}-${params.courseId || ''}-${params.studentName || ''}-${params.semester || ''}-${params.schoolId || ''}-${params.yearOffered || ''}-${params.offeringType || ''}-${params.programId || ''}-${params.startDate || ''}-${params.endDate || ''}`;

  // Generate URL inside the fetcher to ensure it uses current parameters
  const generateUrl = (currentParams) => {
    let url = `branches/${DEFAULT_BRANCH_ID()}/enrollments`;
    const queryParams = new URLSearchParams();

    if (currentParams.pageNo) queryParams.append('pageNo', currentParams.pageNo);
    if (currentParams.pageSize) queryParams.append('pageSize', currentParams.pageSize);
    if (currentParams.courseId) queryParams.append('courseId', currentParams.courseId);
    if (currentParams.studentName) queryParams.append('studentName', currentParams.studentName);
    if (currentParams.semester) queryParams.append('semester', currentParams.semester);
    if (currentParams.schoolId) queryParams.append('schoolId', currentParams.schoolId);
    if (currentParams.yearOffered) queryParams.append('yearOffered', currentParams.yearOffered);
    if (currentParams.startDate) queryParams.append('startDate', currentParams.startDate);
    if (currentParams.endDate) queryParams.append('endDate', currentParams.endDate);
    if (currentParams.offeringType) queryParams.append('offeringType', currentParams.offeringType);
    if (currentParams.programId) queryParams.append('programId', currentParams.programId);

    queryParams.append('includeStudent', 'true');
    queryParams.append('includeCourseOffering', 'true');

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  };

  const { data, mutate, error } = useSWR(swrKey, () => fetcher(generateUrl(params)));
  const isLoading = !data && !error;


  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useEnrollments;
