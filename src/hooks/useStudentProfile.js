import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function useProfile(id) {
  const { data, error } = useSWR(`/students/${id}`, fetcher);
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
  };
}

export default useProfile;
