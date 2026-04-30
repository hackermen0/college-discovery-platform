'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface CompareItem {
  id: string;
  name?: string;
}

interface CompareContextValue {
  selectedItems: CompareItem[];
  selectedIds: string[];
  compareCount: number;
  isHydrated: boolean;
  addToCompare: (id: string, name?: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  setCompareBasket: (items: CompareItem[]) => void;
}

const STORAGE_KEY = 'aisignal-compare-basket';

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

function normalizeItems(items: unknown): CompareItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const normalized: CompareItem[] = [];

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const candidate = item as Partial<CompareItem>;

    if (typeof candidate.id !== 'string' || !candidate.id.trim()) {
      continue;
    }

    normalized.push({
      id: candidate.id,
      name: typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name : undefined
    });
  }

  return normalized.slice(0, 3);
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<CompareItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        setSelectedItems(normalizeItems(JSON.parse(storedValue)));
      }
    } catch {
      setSelectedItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems));
  }, [isHydrated, selectedItems]);

  const value = useMemo<CompareContextValue>(() => {
    const selectedIds = selectedItems.map((item) => item.id);

    return {
      selectedItems,
      selectedIds,
      compareCount: selectedItems.length,
      isHydrated,
      addToCompare: (id: string, name?: string) => {
        setSelectedItems((current) => {
          const existingIndex = current.findIndex((item) => item.id === id);

          if (existingIndex >= 0) {
            const nextItems = [...current];
            nextItems[existingIndex] = {
              id,
              name: name ?? nextItems[existingIndex].name
            };
            return nextItems;
          }

          if (current.length >= 3) {
            return current;
          }

          return [...current, { id, name }];
        });
      },
      removeFromCompare: (id: string) => {
        setSelectedItems((current) => current.filter((item) => item.id !== id));
      },
      clearCompare: () => {
        setSelectedItems([]);
      },
      isInCompare: (id: string) => selectedItems.some((item) => item.id === id),
      setCompareBasket: (items: CompareItem[]) => {
        setSelectedItems(normalizeItems(items));
      }
    };
  }, [isHydrated, selectedItems]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }

  return context;
}