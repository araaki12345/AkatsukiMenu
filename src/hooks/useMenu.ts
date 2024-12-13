'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonthlyMenu = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

      const { data, error: fetchError } = await supabase
        .from('menu')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      console.error('Error fetching monthly menu:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentMenu = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      
      const { data, error: fetchError } = await supabase
        .from('menu')
        .select('*')
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      return data || null;
    } catch (err) {
      console.error('Error fetching current menu:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchMonthlyMenu,
    fetchCurrentMenu,
  };
};