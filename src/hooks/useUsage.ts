import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spell-checker_texts_usage_v2';
const UPDATE_DATE_KEY = 'spell-checker_texts_usage_updated_date_v2';
const MAX_USAGE = 3;

const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export function useUsage(idTool: string = '') {
  const [usageCount, setUsageCount] = useState(0);
  const [storageAvailable] = useState(isStorageAvailable());

  const storageKey = `${STORAGE_KEY}_${idTool}`;
  const updateDateKey = `${UPDATE_DATE_KEY}_${idTool}`;

  useEffect(() => {
    if (storageAvailable) {
      checkAndResetUsage();
      const count = getUserUsage();
      setUsageCount(count);
    }
  }, []);

  const checkAndResetUsage = () => {
    try {
      const usageUpdated = localStorage.getItem(updateDateKey);
      if (usageUpdated) {
        const lastUpdate = new Date(usageUpdated);
        const now = new Date();
        
        // Check if the date has changed (ignoring time)
        if (lastUpdate.getDate() !== now.getDate() || 
            lastUpdate.getMonth() !== now.getMonth() || 
            lastUpdate.getFullYear() !== now.getFullYear()) {
          localStorage.setItem(storageKey, '0');
          localStorage.setItem(updateDateKey, new Date().toISOString());
          setUsageCount(0);
        }
      }
    } catch (error) {
      console.warn('Failed to check/reset usage:', error);
    }
  };

  const getUserUsage = () => {
    try {
      return Number(localStorage.getItem(storageKey) || '0');
    } catch (error) {
      console.warn('Failed to get usage:', error);
      return 0;
    }
  };

  const incrementUsage = () => {
    try {
      if (storageAvailable) {
        const newUsage = getUserUsage() + 1;
        localStorage.setItem(storageKey, newUsage.toString());
        localStorage.setItem(updateDateKey, new Date().toISOString());
        setUsageCount(newUsage);
      }
    } catch (error) {
      console.warn('Failed to increment usage:', error);
    }
  };

  return {
    usageCount,
    maxUsage: MAX_USAGE,
    incrementUsage,
    isLimitReached: usageCount >= MAX_USAGE,
    storageAvailable
  };
} 