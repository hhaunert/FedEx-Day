'use client'

import { useState } from 'react'

const SECTIONS = [
  { id: 'clipping', label: 'Clipping Image' },
  { id: 'clue-report', label: 'Clue Report' },
  { id: 'research-trail', label: 'Research Trail' },
  { id: 'story-path', label: 'Story Path' },
  { id: 'transcription', label: 'Transcription' },
]

export default function BuildPdfButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(
    new Set(SECTIONS.map((s) => s.id))
  )

  const allSelected = selected.size === SECTIONS.length

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(SECTIONS.map((s) => s.id)))
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleBuild = () => {
    const sections = SECTIONS.map((s) => s.id).filter((id) => selected.has(id))
    const url = `/api/pdf/${id}?sections=${sections.join(',')}`
    window.open(url, '_blank')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary flex-shrink-0 self-start text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Build Your PDF
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl font-bold text-brand-darker mb-1">Build Your PDF</h2>
            <p className="text-sm text-brand-gray-dark mb-5">Choose which sections to include.</p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer group pb-3 border-b border-brand-gray-border">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-brand-red rounded"
                />
                <span className="text-sm font-semibold text-brand-darker group-hover:text-brand-red transition-colors">
                  {allSelected ? 'Unselect All' : 'Select All'}
                </span>
              </label>

              {SECTIONS.map((section) => (
                <label
                  key={section.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(section.id)}
                    onChange={() => toggle(section.id)}
                    className="w-4 h-4 accent-brand-red rounded"
                  />
                  <span className="text-sm text-brand-darker group-hover:text-brand-red transition-colors">
                    {section.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBuild}
                disabled={selected.size === 0}
                className="flex-1 btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
