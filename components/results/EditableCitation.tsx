'use client'

import { useState } from 'react'

interface Props {
  id: string
  newspaperName: string | null
  newspaperDate: string | null
  newspaperPage: string | null
}

export default function EditableCitation({ id, newspaperName, newspaperDate, newspaperPage }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(newspaperName || '')
  const [date, setDate] = useState(newspaperDate || '')
  const [page, setPage] = useState(newspaperPage || '')

  const save = async () => {
    setSaving(true)
    await fetch(`/api/clippings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newspaper_name: name, newspaper_date: date, newspaper_page: page }),
    })
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setName(newspaperName || '')
    setDate(newspaperDate || '')
    setPage(newspaperPage || '')
    setEditing(false)
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-darker text-sm">Citation</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
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
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Publication</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="Newspaper name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="e.g. May 9, 1912"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-darker block mb-1">Page</label>
            <input
              type="text"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="w-full text-sm border border-brand-gray-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-red"
              placeholder="e.g. Page 1"
            />
          </div>
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
              className="text-xs px-3 py-1.5 rounded-lg border border-brand-gray-border text-brand-gray-dark hover:border-brand-darker transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm text-brand-gray-dark">
          <p>
            <span className="font-medium text-brand-darker">Publication:</span>{' '}
            {name || <span className="italic text-brand-gray-border">Unknown</span>}
          </p>
          <p>
            <span className="font-medium text-brand-darker">Date:</span>{' '}
            {date || <span className="italic text-brand-gray-border">Unknown</span>}
          </p>
          <p>
            <span className="font-medium text-brand-darker">Page:</span>{' '}
            {page || <span className="italic text-brand-gray-border">Unknown</span>}
          </p>
        </div>
      )}
    </div>
  )
}
