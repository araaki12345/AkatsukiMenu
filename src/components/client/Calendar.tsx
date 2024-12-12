import { useState, useEffect } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from '@/types/menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = () => {
  const { fetchMonthlyMenu, isLoading } = useMenu();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenu = async () => {
      const items = await fetchMonthlyMenu(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setMenuItems(items);
    };
    loadMenu();
  }, [currentDate, fetchMonthlyMenu]);

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  };

  // カレンダーグリッドの生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startOffset = firstDay.getDay();
    
    // 前月の日付を追加
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // 当月の日付を追加
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const menuItem = menuItems.find(item => item.date === dateStr);
      days.push({ day, menuItem });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-primary">
          {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h2>
        
        <button 
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
        
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className={`min-h-[100px] border rounded p-2 ${
              dayData ? 'hover:bg-gray-50' : 'bg-gray-50'
            }`}
          >
            {dayData && (
              <>
                <div className="font-semibold mb-1">{dayData.day}</div>
                {dayData.menuItem && (
                  <div className="text-xs">
                    <div className="text-gray-600">朝: {dayData.menuItem.breakfast}</div>
                    <div className="text-gray-600">夕: {dayData.menuItem.dinner}</div>
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