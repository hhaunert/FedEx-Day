'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Clipping {
  id: string
  title: string | null
  image_url: string | null
  newspaper_name: string | null
  newspaper_date: string | null
  created_at: string
  status: string | null
}

function EditableTitle({ id, initialTitle, onSave }: { id: string; initialTitle: string | null; onSave: (id: string, title: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialTitle || '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = async () => {
    setSaving(true)
    await fetch(`/api/clippings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: value }),
    })
    onSave(id, value)
    setSaving(false)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setValue(initialTitle || ''); setEditing(false) }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          maxLength={100}
          className="text-sm font-semibold border border-brand-red rounded px-2 py-0.5 w-full focus:outline-none"
        />
        {saving && <span className="text-xs text-brand-gray-mid flex-shrink-0">Saving...</span>}
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1 group/title cursor-pointer"
      onClick={(e) => { e.preventDefault(); setEditing(true) }}
      title="Click to edit name"
    >
      <p className="font-semibold text-brand-darker text-sm truncate flex-1 hover:text-brand-red transition-colors">
        {value || <span className="italic font-normal text-brand-gray-border">Add a name...</span>}
      </p>
      <svg className="w-3 h-3 text-brand-gray-border opacity-0 group-hover/title:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
  )
}

export default function ClippingsGrid({ clippings: initial }: { clippings: Clipping[] }) {
  const [clippings, setClippings] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const res = await fetch(`/api/clippings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setClippings((prev) => prev.filter((c) => c.id !== id))
      router.refresh()
    }
    setDeletingId(null)
    setConfirmId(null)
  }

  const handleTitleSave = (id: string, title: string) => {
    setClippings((prev) => prev.map((c) => c.id === id ? { ...c, title } : c))
  }

  if (clippings.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="w-20 h-20 bg-brand-gray-lighter rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-gray-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-darker mb-3">No clippings yet</h2>
        <p className="text-brand-gray-dark mb-8 max-w-md mx-auto">
          Upload your first newspaper clipping to get started with AI-powered genealogy analysis.
        </p>
        <Link href="/analyze" className="btn-primary">Analyze Your First Clipping</Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {clippings.map((clipping) => (
        <div key={clipping.id} className="card overflow-hidden group relative">
          {/* Delete button */}
          <button
            onClick={() => setConfirmId(clipping.id)}
            className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 hover:bg-red-50 border border-brand-gray-border hover:border-brand-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5 text-brand-gray-mid hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Link href={`/result/${clipping.id}`} className="block">
            <div className="aspect-[3/4] bg-white border-b border-brand-gray-border relative overflow-hidden">
              {clipping.image_url ? (
                <Image
                  src={clipping.image_url}
                  alt={clipping.newspaper_name || 'Newspaper clipping'}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-brand-gray-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {clipping.status === 'pending' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="badge bg-yellow-100 text-yellow-800">Processing...</span>
                </div>
              )}
            </div>
          </Link>

          <div className="p-4">
            <EditableTitle
              id={clipping.id}
              initialTitle={clipping.title}
              onSave={handleTitleSave}
            />

            <Link href={`/result/${clipping.id}`}>
              <p className="text-brand-gray-mid text-xs mt-1 truncate">
                {clipping.newspaper_name || 'Unknown Newspaper'}
                {clipping.newspaper_date ? ` · ${clipping.newspaper_date}` : ''}
              </p>
            </Link>

            <p className="text-brand-gray-border text-xs mt-2">
              {new Date(clipping.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>

          {/* Confirm delete overlay */}
          {confirmId === clipping.id && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center z-20">
              <p className="font-semibold text-brand-darker text-sm mb-1">Delete this analysis?</p>
              <p className="text-xs text-brand-gray-mid mb-4">This can't be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmId(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                <button
                  onClick={() => handleDelete(clipping.id)}
                  disabled={deletingId === clipping.id}
                  className="bg-brand-red text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === clipping.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
