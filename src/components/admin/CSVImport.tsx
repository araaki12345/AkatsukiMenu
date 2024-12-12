import { useCallback, useState } from 'react';
import { useMenu } from '@/hooks/useMenu';

export const CSVImport = () => {
  const { importMenuData, isLoading, error } = useMenu();
  const [message, setMessage] = useState('');

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage('');
    
    try {
      const text = await file.text();
      const success = await importMenuData(text);
      
      if (success) {
        setMessage('献立データのインポートが完了しました。');
      }
    } catch (err) {
      setMessage('エラーが発生しました。ファイルを確認してください。');
    }
  }, [importMenuData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-primary mb-6">献立データのインポート</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('エラー') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <label className="block">
          <span className="text-gray-700">CSVファイルを選択してください</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full mt-2 text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-opacity-90"
          />
        </label>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          インポート中...
        </div>
      )}
    </div>
  );
};