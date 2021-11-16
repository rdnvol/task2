import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const useDebounce = (callback, delay) => {
  const latestCallback: any = useRef();
  const latestTimeout: any = useRef();

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  return () => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current);
    }

    latestTimeout.current = setTimeout(() => {
      latestCallback.current();
    }, delay);
  };
};

export default useDebounce;
