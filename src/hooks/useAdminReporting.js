import useSWR from 'swr';
import moment from 'moment';
import fetcher from '../utils/fetcher';

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (value instanceof Date) {
      query.append(key, value.toISOString());
      return;
    }

    if (moment.isMoment(value)) {
      query.append(key, value.toDate().toISOString());
      return;
    }

    query.append(key, value);
  });

  return query.toString();
};

function useAdminReporting(params) {
  const queryString = buildQuery(params);
  const swrKey = params?.branchId ? ['admin-reporting', queryString] : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, () =>
    fetcher(`admin/reporting?${queryString}`)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export default useAdminReporting;
