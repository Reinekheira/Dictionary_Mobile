import { useState, useCallback, useEffect } from 'react';
import { SearchHistoryItem } from '@/types/dictionary';

const STORAGE_KEY = 'search_history';
const MAX_HISTORY = 50;

function loadHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as SearchHistoryItem[];
    }
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveHistory(items: SearchHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addToHistory: (word: string) => void;
  clearHistory: () => void;
  removeFromHistory: (word: string) => void;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<SearchHistoryItem[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addToHistory = useCallback((word: string) => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.word !== trimmed);
      return [{ word: trimmed, searchedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((word: string) => {
    setHistory((prev) => prev.filter((item) => item.word !== word.toLowerCase()));
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory };
}
