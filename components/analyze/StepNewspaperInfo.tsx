'use client'

interface NewspaperInfo {
  newspaper_name: string
  newspaper_date: string
  newspaper_page: string
}

interface StepNewspaperInfoProps {
  info: NewspaperInfo
  onChange: (info: NewspaperInfo) => void
  isLoading?: boolean
}

export default function StepNewspaperInfo({ info, onChange, isLoading }: StepNewspaperInfoProps) {
  const handleChange = (field: keyof NewspaperInfo, value: string) => {
    onChange({ ...info, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">
          Review Newspaper Details
        </h2>
        <p className="text-brand-gray-dark">
          Our AI has extracted the following details from your clipping. Please review and correct any errors.
        </p>
      </div>

      {isLoading ? (
        <div className="card p-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="animate-spin w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-medium text-brand-darker">AI is reading your clipping...</span>
          </div>
          <p className="text-sm text-brand-gray-mid">Extracting newspaper details and transcription</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AI has pre-filled these fields. Review and correct as needed before continuing.
          </div>

          <div>
            <label htmlFor="newspaper_name" className="label">
              Newspaper Name
            </label>
            <input
              id="newspaper_name"
              type="text"
              value={info.newspaper_name}
              onChange={(e) => handleChange('newspaper_name', e.target.value)}
              placeholder="e.g. The Daily Tribune"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="newspaper_date" className="label">
              Publication Date
            </label>
            <input
              id="newspaper_date"
              type="text"
              value={info.newspaper_date}
              onChange={(e) => handleChange('newspaper_date', e.target.value)}
              placeholder="e.g. January 15, 1923"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="newspaper_page" className="label">
              Page Number
            </label>
            <input
              id="newspaper_page"
              type="text"
              value={info.newspaper_page}
              onChange={(e) => handleChange('newspaper_page', e.target.value)}
              placeholder="e.g. Page 3"
              className="input-field"
            />
          </div>
        </div>
      )}
    </div>
  )
}
