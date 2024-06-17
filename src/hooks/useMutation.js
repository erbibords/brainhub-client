import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { mutate as swrMutate } from 'swr';

const useMutation = (url, method = 'POST', revalidationUrl = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeMutation = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (method) {
        case 'POST':
          response = await axiosInstance.post(url, data);
          break;
        case 'PUT':
          response = await axiosInstance.put(url, data);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(url, { data });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (revalidationUrl) {
        console.log('Revalidating URL:', revalidationUrl);
        const revalidatedData = await axiosInstance.get(revalidationUrl).then(res => res.data);
        await swrMutate(revalidationUrl, revalidatedData, { revalidate: true });
        console.log('Revalidation complete');
      }

      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, revalidationUrl]);

  return { mutate: executeMutation, loading, error };
};

export default useMutation;
