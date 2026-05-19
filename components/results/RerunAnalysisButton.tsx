'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RerunAnalysisButton({ id }: { id: string }) {
  const router = useRouter()
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(false)

  const rerun = async () => {
    setRunning(true)
    setError(false)
    const res = await fetch(`/api/clippings/${id}/reanalyze`, { method: 'POST' })
    setRunning(false)
    if (res.ok) {
      router.refresh()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={rerun}
        disabled={running}
        className="btn-ghost text-sm flex items-center gap-2 disabled:opacity-50"
      >
        {running ? (
          <>
            <svg className="animate-spin w-4 h-4 text-brand-red flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Rerunning…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rerun Analysis
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">Reanalysis failed. Please try again.</p>}
    </div>
  )
}
