import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { COURSE_BASE_URL } from '../constants';
import { useBranch } from '../contexts/branch';

function useCourse(courseId) {
  const { branchId } = useBranch();

  const resourceKey = useMemo(() => {
    if (!courseId) {
      return null;
    }

    return `${COURSE_BASE_URL()}/${courseId}`;
  }, [courseId, branchId]);

  const { data, error } = useSWR(resourceKey);
  const isLoading = !data && !error;

  const refetch = useCallback(() => {
    if (resourceKey) {
      mutate(resourceKey);
    }
  }, [resourceKey]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export default useCourse;
