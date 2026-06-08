import { useState, useCallback } from 'react';
import axios from 'axios';
import { DictionaryEntry, DictionaryError } from '@/types/dictionary';
import { DICTIONARY_API_BASE } from '@/constants/api';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseDictionaryReturn {
  entry: DictionaryEntry | null;
  error: string | null;
  status: SearchStatus;
  searchWord: (word: string) => Promise<DictionaryEntry | null>;
  reset: () => void;
}

export function useDictionary(): UseDictionaryReturn {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');

  const reset = useCallback(() => {
    setEntry(null);
    setError(null);
    setStatus('idle');
  }, []);

  const searchWord = useCallback(async (word: string): Promise<DictionaryEntry | null> => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter a word to search.');
      setStatus('error');
      return null;
    }

    if (trimmed.split(/\s+/).length > 1) {
      setError('Please search for one word, not a sentence.');
      setStatus('error');
      return null;
    }

    if (/\d/.test(trimmed)) {
      setError('Please search for a word instead of numbers.');
      setStatus('error');
      return null;
    }

    if (/[^a-zA-Z\s'-]/.test(trimmed)) {
      setError('Please search for a word instead of numbers.');
      setStatus('error');
      return null;
    }

    setStatus('loading');
    setError(null);
    setEntry(null);

    try {
      const response = await axios.get<DictionaryEntry[] | DictionaryError>(
        `${DICTIONARY_API_BASE}/${encodeURIComponent(trimmed)}`
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const data = response.data[0];
        setEntry(data);
        setStatus('success');
        return data;
      }

      setError('Word not found. Please check the spelling and try again.');
      setStatus('error');
      return null;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Word not found. Please check the spelling and try again.');
        } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setStatus('error');
      return null;
    }
  }, []);

  return { entry, error, status, searchWord, reset };
}
