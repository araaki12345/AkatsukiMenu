'use client';

import { useCallback, useState } from 'react';

export const JSONImport = () => {
  const [message, setMessage] = useState('');

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text); // JSON ファイルを解析
      console.log('Imported Data:', data);

      // データ形式の検証
      if (!Array.isArray(data)) {
        throw new Error('JSONデータが配列形式ではありません');
      }

      // ローカルストレージに保存
      const formattedData = data.reduce((acc: any, item: any) => {
        const monthKey = item.date.slice(0, 7); // YYYY-MM
        if (!acc[monthKey]) acc[monthKey] = { items: [], lastUpdated: new Date().toISOString() };
        acc[monthKey].items.push(item);
        return acc;
      }, {});

      localStorage.setItem('menuData', JSON.stringify(formattedData));
      setMessage('献立データのインポートが成功しました！');
    } catch (err) {
      console.error('Import Error:', err);
      setMessage('データのインポートに失敗しました。JSON形式を確認してください。');
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-primary mb-4">JSONデータのインポート</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes('失敗') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="block">
            <span className="text-gray-700">JSONファイルを選択してください</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full mt-2 text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-opacity-90"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
