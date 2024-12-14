'use client'

import { useState, useEffect } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from '@/types/menu';
import { ChevronLeft, ChevronRight, Coffee, Utensils } from 'lucide-react';
import { MenuDetailModal } from './MenuDetailModal';
import { CalendarDay } from '@/types/calendar';

const processMenuItems = (menuText: string) => {
  return menuText
    .split(/[\n\s]/)
    .filter(item => item.trim().length > 0)
    .map(item => item.replace(/　/g, ''));
};

const CalendarCell = ({
  dayData,
  index,
  onClick
}: {
  dayData: CalendarDay | null;
  index: number;
  onClick: () => void;
}) => {
  if (!dayData) {
    return <div className="w-full h-full bg-gray-50 rounded-lg" />;
  }

  return (
    <div
      onClick={onClick}
      className={`w-full h-24 md:h-32 border rounded-lg flex flex-col items-center justify-between ${dayData.isToday ? 'ring-2 ring-primary' :
          dayData.menuItem.noMenu ? 'bg-red-50' :
            'hover:bg-gray-50 cursor-pointer'
        } transition-colors p-2`}
    >
      {/* 日付部分 */}
      <div
        className={`font-bold text-xs md:text-base ${index % 7 === 0 ? 'text-red-500' :
          index % 7 === 6 ? 'text-blue-500' :
            'text-gray-700'
        }`}
      >
        {dayData.day}
      </div>

      {/* コンテンツ部分 */}
      {dayData.menuItem.noMenu ? (
        // 寮食なしの日
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div
            className="text-center text-red-500 font-medium text-[10px] md:text-sm"
            style={{ whiteSpace: 'nowrap' }}
          >
            寮食なし
          </div>
        </div>
      ) : (
        // 寮食がある日
        <div className="flex flex-col items-center justify-evenly text-center h-full w-full space-y-1">
          {/* 朝食 */}
          <div className="flex items-center gap-0.5 md:gap-1 text-gray-600">
            <Coffee className="w-2 h-2 md:w-3 md:h-3 flex-shrink-0" />
            <div className="text-[8px] md:text-xs line-clamp-2 md:line-clamp-2 overflow-hidden">
              {processMenuItems(dayData.menuItem.breakfast).join(' ')}
            </div>
          </div>

          {/* 夕食 */}
          <div className="flex items-center gap-0.5 md:gap-1 text-gray-600">
            <Utensils className="w-2 h-2 md:w-3 md:h-3 flex-shrink-0" />
            <div className="text-[8px] md:text-xs line-clamp-2 md:line-clamp-2 overflow-hidden">
              {processMenuItems(dayData.menuItem.dinner).join(' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Calendar = () => {
  const { fetchMonthlyMenu, isLoading } = useMenu();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<{
    menu: MenuItem;
    date: Date;
  } | null>(null);

  // 3ヶ月先の末日まで
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  useEffect(() => {
    const loadMenu = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const items = await fetchMonthlyMenu(year, month);
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

  const generateCalendarDays = (date: Date, menuItems: MenuItem[]): (CalendarDay | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (CalendarDay | null)[] = [];
    const startOffset = firstDay.getDay();

    // 月初の曜日分、nullを入れて空セルを埋める
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // 1日〜末日までをループ
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const menuItem = menuItems.find((item) => item.date === dateStr);
      const isToday = dateStr === today.toISOString().slice(0, 10);

      days.push({
        day,
        menuItem: menuItem || {
          id: '',
          date: dateStr,
          breakfast: "寮食はありません",
          dinner: "寮食はありません",
          noMenu: true
        },
        isToday
      });
    }

    return days;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-2xl shadow-lg p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-7 gap-1 md:gap-4 auto-rows-[5rem] md:auto-rows-[6rem]">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        {/* 月選択部分 */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentDate <= today}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-bold text-primary">
            {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
          </h2>

          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentDate >= maxDate}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* カレンダーグリッド */}
        <div className="w-full">
          <div className="grid grid-cols-7 gap-1 md:gap-4">
            {/* 曜日ヘッダー */}
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center font-bold text-xs md:text-base ${index === 0 ? 'text-red-500' :
                  index === 6 ? 'text-blue-500' :
                    'text-gray-700'
                  }`}
              >
                {day}
              </div>
            ))}

            {/* カレンダーセル */}
            {generateCalendarDays(currentDate, menuItems).map((dayData, index) => (
              <CalendarCell
                key={index}
                dayData={dayData}
                index={index}
                onClick={() => {
                  if (dayData && !dayData.menuItem.noMenu) {
                    setSelectedMenu({
                      menu: dayData.menuItem,
                      date: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        dayData.day
                      )
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu.menu}
          date={selectedMenu.date}
          onClose={() => setSelectedMenu(null)}
        />
      )}
    </>
  );
}