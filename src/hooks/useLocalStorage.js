import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'birthday-memories';
const STORAGE_VERSION = 1;

export const useLocalStorage = (initialValue = []) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('useLocalStorage: Loaded from storage', { 
          version: parsed.version, 
          itemsCount: parsed.items?.length 
        });
        if (parsed.version === STORAGE_VERSION) {
          return parsed.items || [];
        }
      }
    } catch (error) {
      console.error('useLocalStorage: Failed to load from localStorage:', error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      const data = {
        version: STORAGE_VERSION,
        items,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('useLocalStorage: Saved to storage', { itemsCount: items.length });
    } catch (error) {
      console.error('useLocalStorage: Failed to save to localStorage:', error);
    }
  }, [items]);

  const addItem = useCallback((item) => {
    console.log('useLocalStorage: addItem', item);
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    console.log('useLocalStorage: updateItem', { id, updates });
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
    ));
  }, []);

  const deleteItem = useCallback((id) => {
    console.log('useLocalStorage: deleteItem', id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const getItem = useCallback((id) => {
    const item = items.find(item => item.id === id);
    console.log('useLocalStorage: getItem', { id, found: !!item });
    return item;
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    setItems
  };
};
