import { useState, useEffect } from 'react';

const STORAGE_KEY = 'birthday-memories';
const STORAGE_VERSION = 1;

export const useLocalStorage = (initialValue = []) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          return parsed.items || [];
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
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
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [items]);

  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItem = (id) => {
    return items.find(item => item.id === id);
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    setItems
  };
};
