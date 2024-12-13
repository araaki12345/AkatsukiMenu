'use client';
import { DailyMenu } from '@/components/client/DailyMenu'
import { Calendar } from '@/components/client/Calendar'

export default function Home() {
  return (
    <div className="space-y-6">
      <DailyMenu />
      <Calendar />
    </div>
  )
}