import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { mutate as swrMutate } from 'swr';

const useMutation = (
  url,
  method = 'POST',
  cacheKey = null,
  config = undefined
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const executeMutation = useCallback(
    async (data, optionalUrl) => {
      setLoading(true);
      setError(null);
      try {
        let response;
        switch (method) {
          case 'POST':
            console.log('submitting', {
              url: optionalUrl ?? url,
              data: JSON.stringify(data),
              config,
            });
            response = await axiosInstance.post(
              optionalUrl ?? url,
              data,
              config
            );
            break;
          case 'PUT':
            response = await axiosInstance.put(optionalUrl ?? url, data);
            break;
          case 'DELETE':
            response = await axiosInstance.delete(optionalUrl ?? url, { data });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (cacheKey) {
          swrMutate(cacheKey);
        }

        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method, cacheKey]
  );

  return { mutate: executeMutation, loading, error };
};

export default useMutation;
