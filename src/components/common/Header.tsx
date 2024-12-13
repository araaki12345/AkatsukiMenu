'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Header = () => {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <header className="bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl font-bold">静岡大学あかつき寮</span>
          </Link>
          
          {isAdmin && (
            <div className="text-white/80 text-sm">
              管理者モード
            </div>
          )}
        </div>
      </div>
    </header>
  )
}