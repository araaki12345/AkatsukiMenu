// src/components/admin/JSONImport.tsx
'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MenuItem } from '@/types/menu';

export const JSONImport = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ success: 0, skipped: 0, failed: 0 });

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const text = await file.text();
      const data = JSON.parse(text) as MenuItem[];
  
      console.log('Importing data:', data);
  
      if (!Array.isArray(data)) {
        throw new Error('JSONデータが配列形式ではありません');
      }
  
      let successCount = 0;
      let skipCount = 0;
      let failCount = 0;
  
      for (const item of data) {
        try {
          // Supabaseに送信するデータから noMenu を除外
          const { date, breakfast, dinner } = item;
          
          const { data: existingData, error: fetchError } = await supabase
            .from('menu')
            .select('id')
            .eq('date', date)
            .maybeSingle();
  
          if (fetchError) {
            console.error('Fetch error:', fetchError);
            failCount++;
            continue;
          }
  
          if (existingData) {
            console.log(`Skipping existing date: ${date}`);
            skipCount++;
            continue;
          }
  
          const { error: insertError } = await supabase
            .from('menu')
            .insert({
              date,
              breakfast,
              dinner
            });
  
          if (insertError) {
            console.error('Insert error:', insertError);
            failCount++;
            continue;
          }
  
          successCount++;
        } catch (err) {
          console.error('Process error:', err);
          failCount++;
        }
      }
  
      setStatus({
        success: successCount,
        skipped: skipCount,
        failed: failCount
      });
  
      setMessage(
        `インポート完了: 成功(${successCount}), スキップ(${skipCount}), 失敗(${failCount})`
      );
  
    } catch (err) {
      console.error('Import error:', err);
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

      {(status.success > 0 || status.skipped > 0 || status.failed > 0) && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p>成功: {status.success}</p>
          <p>スキップ: {status.skipped}</p>
          <p>失敗: {status.failed}</p>
        </div>
      )}

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
  );
};