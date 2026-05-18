'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import StepUpload from '@/components/analyze/StepUpload'
import StepNewspaperInfo from '@/components/analyze/StepNewspaperInfo'
import StepDetails from '@/components/analyze/StepDetails'
import StepStoryPicker from '@/components/analyze/StepStoryPicker'

const STEPS = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Review Info' },
  { number: 3, label: 'Add Details' },
  { number: 4, label: 'Pick Stories' },
]

interface NewspaperInfo {
  newspaper_name: string
  newspaper_date: string
  newspaper_page: string
}

export default function AnalyzePage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [newspaperInfo, setNewspaperInfo] = useState<NewspaperInfo>({
    newspaper_name: '',
    newspaper_date: '',
    newspaper_page: '',
  })
  const [userDetails, setUserDetails] = useState('')
  const [analysisTitle, setAnalysisTitle] = useState('')
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const parseFilename = (filename: string): Partial<NewspaperInfo> => {
    // Remove extension
    const name = filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')

    // Try to find a page number
    const pageMatch = name.match(/\bp(?:age)?\s*(\d+)\b/i)
    const page = pageMatch ? `Page ${pageMatch[1]}` : ''

    // Try to find a year (4 digits between 1800-2000)
    const yearMatch = name.match(/\b(1[89]\d{2}|200\d)\b/)

    // Try to find a month name
    const months = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const monthMatch = name.match(new RegExp(`\\b(${months.join('|')})\\b`, 'i'))

    // Try to find a day number
    const dayMatch = name.match(/\b(\d{1,2})\b(?=.*(?:1[89]\d{2}|200\d))/)

    let date = ''
    if (monthMatch && yearMatch) {
      const month = monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1).toLowerCase()
      date = dayMatch ? `${month} ${dayMatch[1]}, ${yearMatch[1]}` : `${month} ${yearMatch[1]}`
    } else if (yearMatch) {
      date = yearMatch[1]
    }

    // Remove page and date parts from name to get publication name
    let pubName = name
    if (pageMatch) pubName = pubName.replace(pageMatch[0], '')
    if (monthMatch) pubName = pubName.replace(monthMatch[0], '')
    if (yearMatch) pubName = pubName.replace(yearMatch[1], '')
    if (dayMatch) pubName = pubName.replace(dayMatch[0], '')
    pubName = pubName.replace(/\s+/g, ' ').replace(/[,\.]+/g, '').trim()

    return {
      newspaper_name: pubName || '',
      newspaper_date: date,
      newspaper_page: page,
    }
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)

    // Immediately parse what we can from the filename
    const fromFilename = parseFilename(file.name)
    if (fromFilename.newspaper_name || fromFilename.newspaper_date) {
      setNewspaperInfo({
        newspaper_name: fromFilename.newspaper_name || '',
        newspaper_date: fromFilename.newspaper_date || '',
        newspaper_page: fromFilename.newspaper_page || '',
      })
    }

    setIsExtracting(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setNewspaperInfo({
          newspaper_name: data.newspaper_name || fromFilename.newspaper_name || '',
          newspaper_date: data.date || fromFilename.newspaper_date || '',
          newspaper_page: data.page || fromFilename.newspaper_page || '',
        })
      }
    } catch (err) {
      console.error('Extraction failed:', err)
      // Keep the filename-parsed values if API fails
    } finally {
      setIsExtracting(false)
    }
  }

  const handleNext = () => {
    setError('')
    if (currentStep === 1 && !selectedFile) {
      setError('Please upload a clipping to continue.')
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('newspaper_name', newspaperInfo.newspaper_name)
      formData.append('newspaper_date', newspaperInfo.newspaper_date)
      formData.append('newspaper_page', newspaperInfo.newspaper_page)
      formData.append('user_details', userDetails)
      formData.append('title', analysisTitle)
      selectedStories.forEach((s) => formData.append('story_types', s))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      const { id } = await response.json()
      router.push(`/result/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return !!selectedFile
    if (currentStep === 4) return true
    return true
  }

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Nav />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-brand-gray-border -z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-brand-red -z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`progress-step-dot ${
                    step.number < currentStep
                      ? 'completed'
                      : step.number === currentStep
                      ? 'active'
                      : 'pending'
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  step.number === currentStep ? 'text-brand-red' : 'text-brand-gray-mid'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6 sm:p-8">
          {currentStep === 1 && (
            <StepUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} isExtracting={isExtracting} />
          )}
          {currentStep === 2 && (
            <StepNewspaperInfo
              info={newspaperInfo}
              onChange={setNewspaperInfo}
              isLoading={isExtracting}
            />
          )}
          {currentStep === 3 && (
            <StepDetails
              value={userDetails}
              onChange={setUserDetails}
              title={analysisTitle}
              onTitleChange={setAnalysisTitle}
            />
          )}
          {currentStep === 4 && (
            <StepStoryPicker selected={selectedStories} onChange={setSelectedStories} />
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting || isExtracting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : currentStep === 4 ? (
                'Generate Report →'
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </div>

        {isSubmitting && (
          <div className="mt-6 card p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="animate-spin w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-medium text-brand-darker">AI is analyzing your clipping...</span>
            </div>
            <p className="text-sm text-brand-gray-dark">
              This may take 30–60 seconds. We&apos;re generating your Clue Report, Stories, and Research Trail.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
