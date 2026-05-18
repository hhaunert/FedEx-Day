'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface StoryType {
  id: string
  slug: string
  name: string
  description: string
  ai_prompt: string
  sort_order: number
  active: boolean
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<StoryType | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [edits, setEdits] = useState<Partial<StoryType>>({})

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('story_types')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setStories(data)
        setLoading(false)
      })
  }, [])

  const handleSelect = (story: StoryType) => {
    setSelected(story)
    setEdits({ name: story.name, description: story.description, ai_prompt: story.ai_prompt })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)

    const { error } = await supabase
      .from('story_types')
      .update(edits)
      .eq('id', selected.id)

    if (!error) {
      setStories((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, ...edits } : s))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
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
        <h1 className="font-serif text-3xl font-bold text-brand-darker">Story Types</h1>
        <p className="text-brand-gray-dark mt-1">Click a story to edit its name, description, and AI prompt.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Story list */}
        <div className="lg:col-span-2 space-y-2">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => handleSelect(story)}
              className={`w-full text-left card px-4 py-3 transition-all ${
                selected?.id === story.id
                  ? 'border-brand-red bg-red-50'
                  : 'hover:border-brand-gray-mid'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-darker text-sm">{story.name}</p>
                  <p className="text-xs text-brand-gray-mid mt-0.5 font-mono">{story.slug}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${story.active ? 'bg-green-400' : 'bg-brand-gray-border'}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Edit panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-darker mb-0.5">{selected.name}</h2>
                <code className="text-xs text-brand-gray-mid">{selected.slug}</code>
              </div>

              <div>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  value={edits.name ?? ''}
                  onChange={(e) => setEdits((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Short Description</label>
                <input
                  type="text"
                  value={edits.description ?? ''}
                  onChange={(e) => setEdits((p) => ({ ...p, description: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">AI Generation Prompt</label>
                <textarea
                  value={edits.ai_prompt ?? ''}
                  onChange={(e) => setEdits((p) => ({ ...p, ai_prompt: e.target.value }))}
                  rows={8}
                  className="input-field resize-none text-sm"
                />
                <p className="text-xs text-brand-gray-mid mt-1">
                  This prompt is sent as the system message when generating this story type.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`btn-primary ${saved ? 'bg-green-600' : ''} disabled:opacity-50`}
                >
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-10 text-center text-brand-gray-mid">
              Select a story type from the list to edit it.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
