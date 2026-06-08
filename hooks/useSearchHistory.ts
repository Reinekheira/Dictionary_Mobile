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

// Module-level global state and listeners to synchronize all useSearchHistory hook instances
let globalHistory: SearchHistoryItem[] = loadHistory();
const listeners = new Set<(items: SearchHistoryItem[]) => void>();

function updateGlobalHistory(newHistory: SearchHistoryItem[]) {
  globalHistory = newHistory;
  saveHistory(newHistory);
  listeners.forEach((listener) => listener(newHistory));
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addToHistory: (word: string) => void;
  clearHistory: () => void;
  removeFromHistory: (word: string) => void;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<SearchHistoryItem[]>(globalHistory);

  useEffect(() => {
    listeners.add(setHistory);
    return () => {
      listeners.delete(setHistory);
    };
  }, []);

  const addToHistory = useCallback((word: string) => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) return;

    const filtered = globalHistory.filter((item) => item.word !== trimmed);
    const newHistory = [{ word: trimmed, searchedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
    updateGlobalHistory(newHistory);
  }, []);

  const clearHistory = useCallback(() => {
    updateGlobalHistory([]);
  }, []);

  const removeFromHistory = useCallback((word: string) => {
    const newHistory = globalHistory.filter((item) => item.word !== word.toLowerCase());
    updateGlobalHistory(newHistory);
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory };
}

