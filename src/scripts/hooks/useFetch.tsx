import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import axios from 'axios';

type OptionsType = { [key: string]: string } | {};

interface PropTypes {
  url: string;
}

const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionsType>({});
  const [url, setUrl] = useState<string>('');

  const doFetch = (url: string = '', options: OptionsType = {}) => {
    setUrl(url);
    setOptions(options);
    setIsLoading(true);
  };

  useEffect(() => {
    if (!isLoading) return;

    axios(`${url}`, options)
      .then(({ data }) => {
        setIsLoading(false);
        setResponse(data);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.response.data);
      });
  }, [isLoading]);

  return [{ response, isLoading, error }, doFetch] as any;
};

export default useFetch;
