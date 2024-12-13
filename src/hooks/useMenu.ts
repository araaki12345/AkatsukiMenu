import { useState, useCallback } from 'react';
import { MenuItem, MenuData, MonthlyMenuData } from '@/types/menu';
import { parseMenuCSV } from '@/utils/csv';

export const useMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const stored = localStorage.getItem('menuData');
      if (!stored) return null;

      const data = JSON.parse(stored) as MonthlyMenuData;
      const currentMonth = today.slice(0, 7);
      return data[currentMonth]?.items.find(item => item.date === today) || null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMonthlyMenu = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const stored = localStorage.getItem('menuData');
      if (!stored) return [];

      const data = JSON.parse(stored) as MonthlyMenuData;
      return data[monthKey]?.items || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importMenuData = useCallback(async (csvContent: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const menuItems = parseMenuCSV(csvContent);
      const monthKey = menuItems[0].date.slice(0, 7);

      const stored = localStorage.getItem('menuData');
      const existingData: MonthlyMenuData = stored ? JSON.parse(stored) : {};

      const updatedData: MonthlyMenuData = {
        ...existingData,
        [monthKey]: {
          items: menuItems,
          lastUpdated: new Date().toISOString()
        }
      };

      const months = Object.keys(updatedData).sort();
      const currentMonth = new Date().toISOString().slice(0, 7);

      if (months.length > 3) {
        const cleanedData: MonthlyMenuData = {};
        months
          .filter(month => month >= currentMonth)
          .slice(-3)
          .forEach(month => {
            cleanedData[month] = updatedData[month];
          });

        localStorage.setItem('menuData', JSON.stringify(cleanedData));
      } else {
        localStorage.setItem('menuData', JSON.stringify(updatedData));
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchCurrentMenu,
    fetchMonthlyMenu,
    importMenuData
  };
};