'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AiPrompt {
  id: string
  name: string
  description: string
  system_prompt: string
  updated_at: string
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<AiPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [edits, setEdits] = useState<Record<string, string>>({})

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('ai_prompts')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) {
          setPrompts(data)
          const initialEdits: Record<string, string> = {}
          data.forEach((p) => {
            initialEdits[p.id] = p.system_prompt
          })
          setEdits(initialEdits)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async (prompt: AiPrompt) => {
    setSaving(prompt.id)
    const { error } = await supabase
      .from('ai_prompts')
      .update({ system_prompt: edits[prompt.id], updated_at: new Date().toISOString() })
      .eq('id', prompt.id)

    if (!error) {
      setSaved((prev) => ({ ...prev, [prompt.id]: true }))
      setTimeout(() => setSaved((prev) => ({ ...prev, [prompt.id]: false })), 2000)
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
        <h1 className="font-serif text-3xl font-bold text-brand-darker">AI Prompts</h1>
        <p className="text-brand-gray-dark mt-1">
          Edit system prompts used for Clue Report and Research Trail generation.
        </p>
      </div>

      <div className="space-y-6">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="card p-6 space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-darker capitalize">
                {prompt.name.replace(/_/g, ' ')}
              </h2>
              <p className="text-sm text-brand-gray-dark mt-1">{prompt.description}</p>
              <p className="text-xs text-brand-gray-border mt-1">
                Last updated: {new Date(prompt.updated_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="label">System Prompt</label>
              <textarea
                value={edits[prompt.id] ?? prompt.system_prompt}
                onChange={(e) =>
                  setEdits((prev) => ({ ...prev, [prompt.id]: e.target.value }))
                }
                rows={12}
                className="input-field resize-y text-sm font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave(prompt)}
                disabled={saving === prompt.id || edits[prompt.id] === prompt.system_prompt}
                className={`btn-primary ${saved[prompt.id] ? 'bg-green-600' : ''} disabled:opacity-50`}
              >
                {saving === prompt.id ? 'Saving...' : saved[prompt.id] ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        ))}

        {prompts.length === 0 && (
          <div className="card p-10 text-center text-brand-gray-mid">
            No AI prompts found. Run the database schema to seed prompts.
          </div>
        )}
      </div>
    </div>
  )
}
