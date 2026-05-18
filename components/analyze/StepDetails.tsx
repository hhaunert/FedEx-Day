'use client'

interface StepDetailsProps {
  value: string
  onChange: (value: string) => void
  title: string
  onTitleChange: (value: string) => void
  suggestedTitle?: string
}

export default function StepDetails({ value, onChange, title, onTitleChange, suggestedTitle }: StepDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">
          Add What You Know
        </h2>
        <p className="text-brand-gray-dark">
          Give this analysis a name and share any background information you already have.
        </p>
      </div>

      <div>
        <label htmlFor="analysis_title" className="label">
          Analysis Name <span className="text-brand-gray-mid font-normal">(optional)</span>
        </label>
        <input
          id="analysis_title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Name this analysis..."
          className="input-field"
          maxLength={100}
        />
        {!title && suggestedTitle && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTitleChange(suggestedTitle)}
              className="inline-flex items-center gap-1 text-xs bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/30 hover:border-brand-red rounded-full px-3 py-1 transition-colors"
            >
              ✦ {suggestedTitle}
            </button>
          </div>
        )}
        <p className="text-xs text-brand-gray-mid mt-1.5">
          This name appears on your dashboard to help you find this analysis later.
        </p>
      </div>

      <div>
        <label htmlFor="user_details" className="label">
          Known Details <span className="text-brand-gray-mid font-normal">(optional)</span>
        </label>
        <textarea
          id="user_details"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder={`Examples:\n• The subject is my great-grandfather John Smith, born 1885 in County Cork, Ireland\n• He immigrated to Pennsylvania around 1905\n• He married Mary O'Brien in 1910 and had 3 children`}
          className="input-field resize-none"
        />
        <p className="text-xs text-brand-gray-mid mt-1.5">
          {value.length} characters · Include names, dates, relationships, locations, or any other details you know
        </p>
      </div>

      <div className="bg-brand-gray-lighter rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-brand-darker text-sm">What to include:</h3>
        <ul className="space-y-1.5 text-sm text-brand-gray-dark">
          {[
            'Full names of people in the clipping',
            'Birth/death dates and places you know',
            'Family relationships (spouse, parent, sibling)',
            'Occupations or trades',
            'Migration history or places lived',
            'Any prior research you\'ve done',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="text-brand-red mt-0.5">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
