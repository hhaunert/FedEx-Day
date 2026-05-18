'use client'

import { useState } from 'react'

interface Props {
  title: string
  subtitle: string
  buttonLabel: string
  children: React.ReactNode
}

export default function ExpandableSection({ title, subtitle, buttonLabel, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-brand-gray-lighter transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1 h-6 bg-brand-red rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-bold text-brand-darker">{title}</h2>
            <p className="text-sm text-brand-gray-mid mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!open && (
            <span className="text-sm font-medium text-brand-red border border-brand-red/30 rounded-full px-3 py-1 hover:bg-red-50 transition-colors">
              {buttonLabel}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-brand-gray-mid transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-brand-gray-border">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  )
}
