import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';
import { JSONImport } from './JSONImport';
import { LogOut, Coffee, Utensils } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

const processMenuItems = (menuText: string) => {
  return menuText
    .split(/[\n\s]/)
    .filter(item => item.trim().length > 0)
    .map(item => item.replace(/　/g, ''));
};

const MenuCard = ({ menu }: { menu: MenuItem }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <h3 className="font-semibold text-gray-900 mb-3">
        {formatDate(menu.date)}
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Coffee className="w-4 h-4" />
            <span className="font-medium">朝食</span>
          </div>
          <div className="pl-6 space-y-1">
            {processMenuItems(menu.breakfast).map((item, index) => (
              <div key={index} className="px-3 py-1.5 bg-gray-50 rounded text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Utensils className="w-4 h-4" />
            <span className="font-medium">夕食</span>
          </div>
          <div className="pl-6 space-y-1">
            {processMenuItems(menu.dinner).map((item, index) => (
              <div key={index} className="px-3 py-1.5 bg-gray-50 rounded text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuSection = ({ 
  title, 
  menus 
}: { 
  title: string; 
  menus: MenuItem[];
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
    {menus.length > 0 ? (
      <div className="space-y-4">
        {menus.map((menu) => (
          <MenuCard key={menu.date} menu={menu} />
        ))}
      </div>
    ) : (
      <p className="text-gray-600">登録された献立がありません</p>
    )}
  </div>
);

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const { fetchMonthlyMenu } = useMenu();
  const [currentMonthMenus, setCurrentMonthMenus] = useState<MenuItem[]>([]);
  const [nextMonthMenus, setNextMonthMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenuData = async () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      const currentData = await fetchMonthlyMenu(currentYear, currentMonth);
      setCurrentMonthMenus(currentData);
      
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nextData = await fetchMonthlyMenu(nextYear, nextMonth);
      setNextMonthMenus(nextData);
    };

    loadMenuData();
  }, [fetchMonthlyMenu]);

  return (
    <div className="space-y-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center pb-6 border-b">
        <h1 className="text-2xl font-bold text-primary">管理ダッシュボード</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      </div>

      {/* JSONインポート部分 */}
      <JSONImport />

      {/* 登録済み献立データの表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MenuSection title="今月の献立" menus={currentMonthMenus} />
        <MenuSection title="来月の献立" menus={nextMonthMenus} />
      </div>

      {/* 注意事項やヘルプ */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">注意事項</h2>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>JSONファイルのフォーマットを確認してからインポートしてください</li>
          <li>データは最大3ヶ月分まで保存されます</li>
          <li>古いデータは自動的に削除されます</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;