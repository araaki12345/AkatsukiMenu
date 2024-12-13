// src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';
import { JSONImport } from './JSONImport';
import { LogOut } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

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
      
      // 今月のデータを取得
      const currentData = await fetchMonthlyMenu(currentYear, currentMonth);
      setCurrentMonthMenus(currentData);
      
      // 来月のデータを取得
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nextData = await fetchMonthlyMenu(nextYear, nextMonth);
      setNextMonthMenus(nextData);
    };

    loadMenuData();
  }, [fetchMonthlyMenu]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

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

      {/* CSVインポート部分 */}
      <JSONImport />

      {/* 登録済み献立データの表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 今月の献立 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-4">今月の献立</h2>
          {currentMonthMenus.length > 0 ? (
            <div className="space-y-4">
              {currentMonthMenus.map((menu) => (
                <div
                  key={menu.date}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formatDate(menu.date)}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">朝食:</span>
                      <p className="text-gray-900">{menu.breakfast}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">夕食:</span>
                      <p className="text-gray-900">{menu.dinner}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">登録された献立がありません</p>
          )}
        </div>

        {/* 来月の献立 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-4">来月の献立</h2>
          {nextMonthMenus.length > 0 ? (
            <div className="space-y-4">
              {nextMonthMenus.map((menu) => (
                <div
                  key={menu.date}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formatDate(menu.date)}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">朝食:</span>
                      <p className="text-gray-900">{menu.breakfast}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">夕食:</span>
                      <p className="text-gray-900">{menu.dinner}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">登録された献立がありません</p>
          )}
        </div>
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