import { useState } from 'react';
import { Results, ApiError } from '../types';

interface UseApiQueryProps {
  endpoint: string;
  isPremium?: boolean;
}

interface QueryParams {
  toRewrite: string;
  toExclude: string;
  writtingStyle: string;
  creativityLevel: string;
  recaptchaToken: string;
  hp: string;
  uuidSearch: string;
  uuidUser: string;
  numberOfSearchesUnderThisUUID: number;
}

interface UseApiQueryReturn {
  loading: boolean;
  error: ApiError | null;
  results: Results | null;
  showAd: boolean;
  setShowAd: (show: boolean) => void;
  setResults: (results: Results | null) => void;
  query: (params: QueryParams) => Promise<void>;
}

export const useApiQuery = ({ endpoint, isPremium = false }: UseApiQueryProps): UseApiQueryReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [showAd, setShowAd] = useState(false);

  const query = async ({
    toRewrite,
    toExclude,
    writtingStyle,
    creativityLevel,
    recaptchaToken,
    hp,
    uuidSearch,
    uuidUser,
    numberOfSearchesUnderThisUUID,
  }: QueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toRewrite,
          toExclude,
          writtingStyle,
          creativityLevel,
          recaptchaToken,
          hp,
          uuidSearch,
          uuidUser,
          numberOfSearchesUnderThisUUID,
          isPremium,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setResults(data);

      // Show ad for non-premium users
      if (!isPremium && data.showAd) {
        setShowAd(true);
      }
    } catch (err) {
      setError({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    showAd,
    setShowAd,
    setResults,
    query,
  };
}; 