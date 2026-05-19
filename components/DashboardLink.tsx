'use client'

import Link from 'next/link'
import { useAnalysisNotifications } from '@/contexts/AnalysisNotificationContext'

interface Props {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function FingerprintIcon() {
  return (
    <svg
      className="w-4 h-4 text-brand-red flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Analysis ready"
      style={{ filter: 'drop-shadow(0 0 4px rgb(185 28 28)) drop-shadow(0 0 8px rgb(185 28 28 / 0.5))' }}
    >
      {/* Lucide fingerprint paths */}
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.88-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 12a10 10 0 0 0 18 0" />
      <path d="M7 16.07A9 9 0 0 1 3.2 10" />
      <path d="M17 16a9 9 0 0 0 3.8-6" />
      <path d="M9 9a3 3 0 0 1 6 0c0 .85-.17 1.66-.47 2.4" />
      <path d="M6 9a6 6 0 0 1 11.19-3" />
      <path d="M5 12.5A7 7 0 0 0 6.5 17" />
      <path d="M18.5 17A7 7 0 0 0 19 12.5" />
    </svg>
  )
}

export default function DashboardLink({ className, children, onClick }: Props) {
  const { notifications, clearNotifications } = useAnalysisNotifications()

  return (
    <Link
      href="/dashboard"
      className={`relative inline-flex items-center gap-1.5 ${className ?? ''}`}
      onClick={() => { clearNotifications(); onClick?.() }}
    >
      {children}
      {notifications.length > 0 && <FingerprintIcon />}
    </Link>
  )
}
