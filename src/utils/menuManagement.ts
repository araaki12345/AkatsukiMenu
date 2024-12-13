import { MenuItem, MenuData } from '../types/menu';

interface MonthlyMenuData {
  [key: string]: MenuData;  // "2025-01" のような形式をキーとして使用
}

export const getMonthKey = (date: Date): string => {
  return date.toISOString().slice(0, 7); // "2025-01" 形式
};

export class MenuDataManager {
  private static readonly MAX_MONTHS = 3; // 保持する最大月数

  static async saveMenuItems(menuItems: MenuItem[]): Promise<void> {
    try {
      // 既存のデータを取得
      const existingData = await this.getAllMenuData();
      
      // 新しいデータの月を特定
      const firstItem = menuItems[0];
      const monthKey = firstItem.date.slice(0, 7);
      
      // 新しいデータを追加
      const updatedData = {
        ...existingData,
        [monthKey]: {
          items: menuItems,
          lastUpdated: new Date().toISOString()
        }
      };

      // 古いデータの削除処理
      const cleanedData = this.cleanOldData(updatedData);

      // データを保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('menuData', JSON.stringify(cleanedData));
      }
      // Vercel KVにも保存
      // await kv.set('menuData', cleanedData);
    } catch (error) {
      console.error('Failed to save menu items:', error);
      throw error;
    }
  }

  private static cleanOldData(data: MonthlyMenuData): MonthlyMenuData {
    const months = Object.keys(data).sort();
    
    if (months.length <= this.MAX_MONTHS) {
      return data;
    }

    // 現在の月を特定
    const currentMonth = getMonthKey(new Date());
    
    // 現在の月より前の月と、MAX_MONTHSを超える月を削除
    const cleanedData: MonthlyMenuData = {};
    months.forEach(month => {
      if (month >= currentMonth && Object.keys(cleanedData).length < this.MAX_MONTHS) {
        cleanedData[month] = data[month];
      }
    });

    return cleanedData;
  }

  static async getCurrentMenu(): Promise<MenuItem | null> {
    try {
      const data = await this.getAllMenuData();
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      
      // 現在の月のデータを検索
      const currentMonthKey = getMonthKey(today);
      const currentMonthData = data[currentMonthKey];
      
      if (!currentMonthData) return null;
      
      return currentMonthData.items.find(item => item.date === todayStr) || null;
    } catch (error) {
      console.error('Failed to get current menu:', error);
      return null;
    }
  }

  static async getMonthlyMenu(year: number, month: number): Promise<MenuItem[]> {
    try {
      const data = await this.getAllMenuData();
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      return data[monthKey]?.items || [];
    } catch (error) {
      console.error('Failed to get monthly menu:', error);
      return [];
    }
  }

  private static async getAllMenuData(): Promise<MonthlyMenuData> {
    // Vercel KVからの取得を試みる
    // try {
    //   const data = await kv.get('menuData');
    //   if (data) return data as MonthlyMenuData;
    // } catch (error) {
    //   console.error('Failed to fetch from KV:', error);
    // }

    // ローカルストレージからのフォールバック
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('menuData');
      if (stored) {
        return JSON.parse(stored);
      }
    }

    return {};
  }
}