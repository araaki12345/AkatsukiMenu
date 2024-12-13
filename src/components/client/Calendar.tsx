import React, { useState, useEffect } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from '@/types/menu';

export const Calendar = () => {
  const { fetchMonthlyMenu, isLoading } = useMenu();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0); // 最大未来3ヶ月

  useEffect(() => {
    const loadMenu = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      console.log('Loading menu for:', year, month);

      const items = await fetchMonthlyMenu(year, month);
      console.log('Received items:', items);

      setMenuItems(items);
    };

    loadMenu();
  }, [currentDate, fetchMonthlyMenu]);

  const changeMonth = (delta: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);

      if (newDate < today) return today;
      if (newDate > maxDate) return maxDate;

      return newDate;
    });
  };

  const generateCalendarDays = (date: Date, menuItems: MenuItem[]) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startOffset = firstDay.getDay();

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const menuItem = menuItems.find((item) => item.date === dateStr);
    
        days.push({
          day,
          menuItem: menuItem || {
            date: dateStr,
            breakfast: "寮食はありません",
            dinner: "寮食はありません",
            noMenu: true // クライアントサイドでのみ使用
          }
        });
      }
    
      return days;
    };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={currentDate <= today}
        >
          &lt;
        </button>

        <h2 className="text-xl font-bold text-primary">
          {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={currentDate >= maxDate}
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}

        {generateCalendarDays(currentDate, menuItems).map((dayData, index) => (
          <div
            key={index}
            className={`min-h-[100px] border rounded p-2 ${
              dayData?.menuItem?.noMenu ? 'bg-red-100' : 'hover:bg-gray-50'
            }`}
          >
            {dayData && (
              <>
                <div className="font-semibold mb-1">{dayData.day}</div>
                {dayData.menuItem?.noMenu ? (
                  <div className="text-center text-red-600 font-bold text-lg">
                    寮食はありません
                  </div>
                ) : (
                  <div className="text-xs">
                    <div className="text-gray-600 line-clamp-2">朝: {dayData.menuItem.breakfast}</div>
                    <div className="text-gray-600 line-clamp-2">夕: {dayData.menuItem.dinner}</div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
