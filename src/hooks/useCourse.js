import useSWR from 'swr';
import { COURSE_BASE_URL } from '../constants';

function useCourse(courseId) {
  const { data, error } = useSWR(`${COURSE_BASE_URL}/${courseId}`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useCourse;
