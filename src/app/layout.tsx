import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext' // AuthProviderをインポート

export const metadata: Metadata = {
  title: '静岡大学あかつき寮 献立表',
  description: 'あかつき寮 献立表管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-white py-4">
              <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold">静岡大学あかつき寮 献立表</h1>
              </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
