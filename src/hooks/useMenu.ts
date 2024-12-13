'use client';

import { useState, useCallback, useEffect } from 'react';
import { MonthlyMenuData } from '@/types/menu';

export const useMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [menuData, setMenuData] = useState<MonthlyMenuData>({});

  useEffect(() => {
    // ローカルストレージからデータを読み込む
    const storedData = localStorage.getItem('menuData');
    if (storedData) {
      setMenuData(JSON.parse(storedData));
    }
  }, []);

  const fetchMonthlyMenu = useCallback((year: number, month: number) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    return menuData[monthKey]?.items || [];
  }, [menuData]);

  const fetchCurrentMenu = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);
    const data = menuData[currentMonth]?.items || [];
    return data.find((item) => item.date === today) || null;
  }, [menuData]);

  return {
    isLoading,
    error,
    fetchMonthlyMenu,
    fetchCurrentMenu,
  };
};
