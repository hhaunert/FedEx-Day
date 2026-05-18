'use client'

const STORY_TYPES = [
  {
    slug: 'ancestor-life',
    name: 'The Ancestor Life Story',
    description: 'Reconstruct your ancestor\'s life narrative from clues in the clipping',
    icon: '👤',
  },
  {
    slug: 'place-story',
    name: 'The Place Story',
    description: 'Explore the location where your ancestor lived and the community they were part of',
    icon: '📍',
  },
  {
    slug: 'historical-context',
    name: 'The Historical Context Story',
    description: 'Situate the clipping within the broader historical events of the era',
    icon: '📜',
  },
  {
    slug: 'day-in-the-life',
    name: 'The "Day in the Life" Story',
    description: 'Imagine and reconstruct what a typical day was like for your ancestor',
    icon: '🌅',
  },
  {
    slug: 'timeline',
    name: 'The Timeline Story',
    description: 'Build a timeline of key events in your ancestor\'s life',
    icon: '📅',
  },
  {
    slug: 'evidence',
    name: 'The Evidence Story',
    description: 'Analyze the clipping as genealogical evidence and assess its research value',
    icon: '🔍',
  },
  {
    slug: 'life-moment',
    name: 'The Life Moment Story',
    description: 'Focus on this single moment in time and its significance to the ancestor',
    icon: '✨',
  },
]

interface StepStoryPickerProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function StepStoryPicker({ selected, onChange }: StepStoryPickerProps) {
  const toggle = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug))
    } else if (selected.length < 3) {
      onChange([...selected, slug])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">
          Choose Your Stories
        </h2>
        <p className="text-brand-gray-dark">
          Select 1 to 3 story types. Each generates a unique narrative from your clipping.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-brand-gray-dark">
          Selected: <strong className="text-brand-darker">{selected.length}</strong> / 3
        </span>
        {selected.length === 3 && (
          <span className="badge bg-green-100 text-green-700">Maximum selected</span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {STORY_TYPES.map((story) => {
          const isSelected = selected.includes(story.slug)
          const isDisabled = !isSelected && selected.length >= 3

          return (
            <button
              key={story.slug}
              type="button"
              onClick={() => toggle(story.slug)}
              disabled={isDisabled}
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

      {selected.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          Please select at least one story type to continue.
        </div>
      )}
    </div>
  )
}
