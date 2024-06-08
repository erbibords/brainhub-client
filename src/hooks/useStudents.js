import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function useStudents(params = {}) {
  const { name = '' } = params;
  
  let url = '/students';
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('name', name);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data, error } = useSWR(url, fetcher);
  const isLoading = !data && !error;

  return {
    students: data,
    error,
    isLoading,
  };
}

export default useStudents;
