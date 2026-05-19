'use client'

import Link from 'next/link'
import { useAnalysisNotifications } from '@/contexts/AnalysisNotificationContext'

interface Props {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function DashboardLink({ className, children, onClick }: Props) {
  const { notifications, clearNotifications } = useAnalysisNotifications()

  return (
    <Link href="/dashboard" className={`relative ${className ?? ''}`} onClick={() => { clearNotifications(); onClick?.() }}>
      {children}
      {notifications.length > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-red rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none">
          {notifications.length}
        </span>
      )}
    </Link>
  )
}
