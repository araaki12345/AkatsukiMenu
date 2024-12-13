'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (!success) {
      setError('ユーザー名またはパスワードが正しくありません。');
    } else {
      router.push('/admin'); // ログイン後ダッシュボードへ
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-primary mb-6">管理者ログイン</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">ユーザー名</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
      >
        ログイン
      </button>
    </form>
  );
};
