'use client'

import { useEffect, useState } from 'react';
import { MenuItem } from '@/types/menu';
import { useMenu } from '@/hooks/useMenu';

export const DailyMenu = () => {
  const { fetchCurrentMenu, isLoading } = useMenu();
  const [menu, setMenu] = useState<MenuItem | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      const currentMenu = await fetchCurrentMenu();
      // ここでsetMenu(fetchCurrentMenu())としていたのを修正
      setMenu(currentMenu);
    };
    loadMenu();
  }, [fetchCurrentMenu]);

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>;
  }

  if (!menu) {
    return (
      <div className="bg-yellow-50 text-yellow-600 rounded-lg p-4 mb-6">
        本日の献立データはありません
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-primary mb-4">
        今日の献立 ({new Date().toLocaleDateString('ja-JP')})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">朝食</h3>
          <p className="text-gray-600 whitespace-pre-line">{menu.breakfast}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">夕食</h3>
          <p className="text-gray-600 whitespace-pre-line">{menu.dinner}</p>
        </div>
      </div>
    </div>
  );
};