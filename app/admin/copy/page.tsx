'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ContentRow {
  id: string
  key: string
  value: string
  updated_at: string
}

export default function AdminCopyPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('content')
      .select('*')
      .order('key')
      .then(({ data }) => {
        if (data) {
          setRows(data)
          const initialEdits: Record<string, string> = {}
          data.forEach((row) => {
            initialEdits[row.id] = row.value
          })
          setEdits(initialEdits)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async (row: ContentRow) => {
    setSaving(row.id)
    const { error } = await supabase
      .from('content')
      .update({ value: edits[row.id], updated_at: new Date().toISOString() })
      .eq('id', row.id)

    if (!error) {
      setSaved((prev) => ({ ...prev, [row.id]: true }))
      setTimeout(() => setSaved((prev) => ({ ...prev, [row.id]: false })), 2000)
    }
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-darker">Copy & Content</h1>
        <p className="text-brand-gray-dark mt-1">Edit site copy inline. Changes save immediately.</p>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs text-brand-gray-mid bg-brand-gray-lighter px-2 py-0.5 rounded">
                {row.key}
              </code>
              <span className="text-xs text-brand-gray-border">
                Updated: {new Date(row.updated_at).toLocaleDateString()}
              </span>
            </div>
            <textarea
              value={edits[row.id] ?? row.value}
              onChange={(e) => setEdits((prev) => ({ ...prev, [row.id]: e.target.value }))}
              rows={row.value.length > 100 ? 3 : 2}
              className="input-field resize-none text-sm"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleSave(row)}
                disabled={saving === row.id || edits[row.id] === row.value}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  saved[row.id]
                    ? 'bg-green-100 text-green-700'
                    : 'btn-primary text-sm px-4 py-1.5'
                } disabled:opacity-50`}
              >
                {saving === row.id ? 'Saving...' : saved[row.id] ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="card p-10 text-center text-brand-gray-mid">
            No content entries found. Run the database schema to seed content.
          </div>
        )}
      </div>
    </div>
  )
}
