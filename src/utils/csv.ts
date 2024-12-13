import { MenuItem } from '@/types/menu';

export const parseMenuCSV = (csvText: string): MenuItem[] => {
  // CSVの行を配列に分割
  const lines = csvText.split('\n');
  
  // ヘッダー情報を取得（年月の解析）
  const headerMatch = lines[1].match(/(\d{4})年\s*(\d{1,2})月/);
  if (!headerMatch) {
    throw new Error('年月の情報が見つかりません');
  }
  const [_, year, month] = headerMatch;
  
  // データ行の開始位置を特定（ヘッダーをスキップ）
  const dataStartIndex = lines.findIndex(line => line.startsWith('日,曜日'));
  if (dataStartIndex === -1) {
    throw new Error('データの開始位置が見つかりません');
  }
  
  // データ行の解析
  const menuItems: MenuItem[] = [];
  
  for (let i = dataStartIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('　　　　★')) continue;
    
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (columns.length < 4) continue;
    
    const day = columns[0].trim();
    if (!day || isNaN(Number(day))) continue;
    
    // 日付の組み立て
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toISOString().split('T')[0];
    
    const breakfast = columns[2]
      .replace(/"/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const dinner = columns[3]
      .replace(/"/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    menuItems.push({
      date,
      breakfast,
      dinner
    });
  }
  
  return menuItems;
};