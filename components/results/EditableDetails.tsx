'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  userDetails: string | null
}

export default function EditableDetails({ id, userDetails }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reanalyzing, setReanalyzing] = useState(false)
  const [error, setError] = useState(false)
  const [saved, setSaved] = useState(userDetails || '')
  const [draft, setDraft] = useState(saved)

  const openEdit = () => {
    setDraft(saved)
    setError(false)
    setEditing(true)
  }

  const cancel = () => {
    setDraft(saved)
    setEditing(false)
  }

  const save = async (withRerun = false) => {
    setSaving(true)
    setError(false)
    const res = await fetch(`/api/clippings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_details: draft }),
    })
    setSaving(false)
    if (!res.ok) { setError(true); return }

    setSaved(draft)
    setEditing(false)

    if (withRerun) {
      setReanalyzing(true)
      await fetch(`/api/clippings/${id}/reanalyze`, { method: 'POST' })
      setReanalyzing(false)
    }

    router.refresh()
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-darker text-sm">Known Details</h3>
        {!editing && (
          <button
            onClick={openEdit}
            className="flex items-center gap-1 text-xs text-brand-gray-mid hover:text-brand-red transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            autoFocus
            className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-2 focus:outline-none focus:border-brand-red resize-none"
            placeholder="Add names, dates, relationships, locations, or any other details you know about the people in this clipping..."
          />
          {error && (
            <p className="text-xs text-red-600">Failed to save. Please try again.</p>
          )}
          {reanalyzing && (
            <p className="text-xs text-brand-gray-dark flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3 text-brand-red flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Rerunning analysis…
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => save(false)}
              disabled={saving || reanalyzing}
              className="bg-brand-red text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving || reanalyzing}
              className="text-xs px-3 py-1.5 rounded-lg border border-brand-red text-brand-red font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Save & Rerun Analysis
            </button>
            <button
              onClick={cancel}
              disabled={saving || reanalyzing}
              className="text-xs px-3 py-1.5 rounded-lg border border-brand-gray-border text-brand-gray-dark hover:border-brand-darker transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {saved ? (
            <p className="text-sm text-brand-gray-dark leading-relaxed whitespace-pre-wrap">{saved}</p>
          ) : (
            <button
              onClick={openEdit}
              className="text-sm italic text-brand-gray-border hover:text-brand-red transition-colors"
            >
              Add known details about this clipping...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
