'use client'

import { useEffect, useState } from 'react';
import { MenuItem } from '@/types/menu';
import { useMenu } from '@/hooks/useMenu';
import { Calendar as CalendarIcon, Coffee, Utensils } from 'lucide-react';

// メニュー項目の処理関数
const processMenuItems = (menuText: string) => {
  return menuText
    .split(/[\n\s]/)
    .filter(item => item.trim().length > 0)
    .map(item => item.replace(/　/g, ''));
};

// メニューセクションコンポーネント
const MenuSection = ({ 
  icon, 
  title, 
  items 
}: { 
  icon: React.ReactNode; 
  title: string; 
  items: string[] 
}) => (
  <div className="p-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-bold text-gray-700">{title}</h3>
    </div>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div 
          key={index}
          className="bg-gray-50 px-4 py-2 rounded-lg text-gray-700"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export const DailyMenu = () => {
  const { fetchCurrentMenu, isLoading } = useMenu();
  const [menu, setMenu] = useState<MenuItem | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      const currentMenu = await fetchCurrentMenu();
      setMenu(currentMenu);
    };
    loadMenu();
  }, [fetchCurrentMenu]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="bg-yellow-50 text-yellow-800 rounded-2xl p-8 mb-6 text-center">
        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-xl font-bold mb-2">本日の献立はありません</h2>
        <p className="text-yellow-600">寮食のお休み日です</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="bg-primary/5 px-6 py-4 border-b">
        <h2 className="text-xl font-bold text-primary">
          {formatDate(new Date())}の献立
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
        <MenuSection
          icon={<Coffee className="w-5 h-5 text-primary" />}
          title="朝食"
          items={processMenuItems(menu.breakfast)}
        />
        <MenuSection
          icon={<Utensils className="w-5 h-5 text-primary" />}
          title="夕食"
          items={processMenuItems(menu.dinner)}
        />
      </div>
    </div>
  );
};