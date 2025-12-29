import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useGetRequestHandler = (url, options = {}) => {
  const {
    enabled = true,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const fetchData = useCallback(async () => {
    if (!enabled || !url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(url);
      setData(response.data);
      if (onSuccessRef.current) {
        onSuccessRef.current(response.data);
      }
    } catch (err) {
      setError(err);
      if (onErrorRef.current) {
        onErrorRef.current(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useGetRequestHandler;

