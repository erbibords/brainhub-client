import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { mutate as swrMutate } from 'swr';
import { invalidateCacheByPattern } from '../utils/cacheInvalidation';

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
      if (loading) return; // Guard
      setLoading(true);
      setError(null);
      try {
        let response;
        switch (method) {
          case 'POST':
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
          if (Array.isArray(cacheKey) || cacheKey.includes("-") || cacheKey.includes("*")) {
            invalidateCacheByPattern(cacheKey);
          } else {
            swrMutate(cacheKey);
          }
        }

        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method, cacheKey, loading]
  );

  return { mutate: executeMutation, loading, error };
};

export default useMutation;
