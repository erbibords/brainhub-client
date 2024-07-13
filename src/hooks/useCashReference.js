import useSWR from 'swr';
import { PAYMENTS_BASE_URL } from '../constants';

function useCashReference() {
  const { data, error, isLoading } = useSWR(`${PAYMENTS_BASE_URL}/cash-reference`);

  return {
    data,
    error,
    isLoading,
  };
}

export default useCashReference;
