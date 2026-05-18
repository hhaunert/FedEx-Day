'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  title: string | null
  newspaperName: string | null
  newspaperDate: string | null
  newspaperPage: string | null
}

function buildCitation(title: string, name: string, date: string, page: string): string {
  const parts: string[] = []
  if (title) parts.push(`"${title}"`)
  if (name) parts.push(name)
  if (date) parts.push(date)
  if (page) {
    const pageStr = page.toLowerCase().startsWith('p') ? page : `p. ${page}`
    parts.push(pageStr)
  }
  return parts.join(', ') + (parts.length ? '.' : '')
}

export default function EditableCitation({ id, title, newspaperName, newspaperDate, newspaperPage }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  const [saved, setSaved] = useState({
    name: newspaperName || '',
    date: newspaperDate || '',
    page: newspaperPage || '',
  })

  const [draft, setDraft] = useState(saved)

  const citation = buildCitation(title || '', saved.name, saved.date, saved.page)

  const openEdit = () => {
    setDraft(saved)
    setError(false)
    setEditing(true)
  }

  const cancel = () => {
    setDraft(saved)
    setEditing(false)
  }

  const save = async () => {
    setSaving(true)
    setError(false)
    const res = await fetch(`/api/clippings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newspaper_name: draft.name,
        newspaper_date: draft.date,
        newspaper_page: draft.page,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(draft)
      setEditing(false)
      router.refresh()
    } else {
      setError(true)
    }
  }

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-darker text-sm">Citation</h3>
        <div className="flex items-center gap-2">
          {!editing && citation && (
            <button
              onClick={copyCitation}
              className="flex items-center gap-1 text-xs text-brand-gray-mid hover:text-brand-red transition-colors"
              title="Copy citation"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
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
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Publication</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="Newspaper name"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Date</label>
            <input
              type="text"
              value={draft.date}
              onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="e.g. May 9, 1912"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Page</label>
            <input
              type="text"
              value={draft.page}
              onChange={(e) => setDraft((d) => ({ ...d, page: e.target.value }))}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="e.g. 1"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600">Failed to save. Please try again.</p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="bg-brand-red text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancel}
              disabled={saving}
              className="text-xs px-3 py-1.5 rounded-lg border border-brand-gray-border text-brand-gray-dark hover:border-brand-darker transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {citation ? (
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              {title && (
                <span>&ldquo;{title},&rdquo; </span>
              )}
              {saved.name && (
                <em>{saved.name}</em>
              )}
              {saved.date && (
                <span>, {saved.date}</span>
              )}
              {saved.page && (
                <span>, {saved.page.toLowerCase().startsWith('p') ? saved.page : `p. ${saved.page}`}</span>
              )}
              <span>.</span>
            </p>
          ) : (
            <p className="text-sm italic text-brand-gray-border">
              No citation info available — click Edit to add details.
            </p>
          )}
          <p className="text-xs text-brand-gray-border mt-3">
            Evidence Explained style · <button onClick={openEdit} className="underline hover:text-brand-red transition-colors">Edit fields</button> to update
          </p>
        </div>
      )}
    </div>
  )
}
