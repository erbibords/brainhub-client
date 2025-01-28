import useSWR, { mutate } from 'swr';
import { COURSE_BASE_URL } from '../constants';

function useCourse(courseId) {
  const { data, error } = useSWR(`${COURSE_BASE_URL}/${courseId}`);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    refetch: () => {
      if (courseId) {
        mutate(`${COURSE_BASE_URL}/${courseId}`);
      }
    },
  };
}

export default useCourse;
