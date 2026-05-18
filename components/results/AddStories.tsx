'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STORY_TYPES = [
  { slug: 'ancestor-life', name: 'The Ancestor Life Story', description: 'Reconstruct your ancestor\'s life narrative from clues in the clipping' },
  { slug: 'place-story', name: 'The Place Story', description: 'Explore the location where your ancestor lived and the community they were part of' },
  { slug: 'historical-context', name: 'The Historical Context Story', description: 'Situate the clipping within the broader historical events of the era' },
  { slug: 'day-in-the-life', name: 'The "Day in the Life" Story', description: 'Imagine and reconstruct what a typical day was like for your ancestor' },
  { slug: 'timeline', name: 'The Timeline Story', description: 'Build a timeline of key events in your ancestor\'s life' },
  { slug: 'evidence', name: 'The Evidence Story', description: 'Analyze the clipping as genealogical evidence and assess its research value' },
  { slug: 'life-moment', name: 'The Life Moment Story', description: 'Focus on this single moment in time and its significance to the ancestor' },
]

interface Props {
  id: string
  existingSlugs: string[]
}

export default function AddStories({ id, existingSlugs }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const available = STORY_TYPES.filter((s) => !existingSlugs.includes(s.slug))

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 3 ? [...prev, slug] : prev
    )
  }

  const generate = async () => {
    if (!selected.length) return
    setGenerating(true)
    setError('')
    const res = await fetch(`/api/clippings/${id}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: selected }),
    })
    setGenerating(false)
    if (res.ok) {
      setOpen(false)
      setSelected([])
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong. Please try again.')
    }
  }

  if (available.length === 0) return null

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-serif text-xl font-bold text-brand-darker flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-red rounded-full inline-block"></span>
          Add Stories
        </h2>
      </div>
      <p className="text-sm text-brand-gray-dark mb-5 ml-3">
        {existingSlugs.length === 0
          ? 'You didn\'t generate any stories for this analysis. Pick up to 3 to generate now.'
          : 'Generate additional stories for this analysis.'}
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary ml-3"
        >
          + Choose Stories
        </button>
      ) : (
        <div className="ml-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {available.map((story) => {
              const isSelected = selected.includes(story.slug)
              const isDisabled = !isSelected && selected.length >= 3
              return (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => toggle(story.slug)}
                  disabled={isDisabled || generating}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? 'border-brand-red bg-red-50'
                      : isDisabled
                      ? 'border-brand-gray-border opacity-40 cursor-not-allowed'
                      : 'border-brand-gray-border hover:border-brand-red hover:bg-red-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-brand-red border-brand-red' : 'border-brand-gray-border'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-darker text-sm">{story.name}</p>
                      <p className="text-xs text-brand-gray-dark mt-0.5 leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={generate}
              disabled={!selected.length || generating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating {selected.length} {selected.length === 1 ? 'Story' : 'Stories'}...
                </span>
              ) : (
                `Generate ${selected.length || ''} ${selected.length === 1 ? 'Story' : 'Stories'}`.trim()
              )}
            </button>
            <button
              onClick={() => { setOpen(false); setSelected([]) }}
              disabled={generating}
              className="btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <span className="text-xs text-brand-gray-mid ml-auto">{selected.length} / 3 selected</span>
          </div>
        </div>
      )}
    </div>
  )
}
