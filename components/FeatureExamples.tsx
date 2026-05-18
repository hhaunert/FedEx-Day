'use client'

import { useState } from 'react'
import ClueReport from '@/components/results/ClueReport'
import ResearchTrail from '@/components/results/ResearchTrail'
import StoryPath from '@/components/results/StoryPath'
import clueReportData from '@/lib/examples/clue-report.json'
import researchTrailData from '@/lib/examples/research-trail.json'
import storyPathData from '@/lib/examples/story-path.json'

type ExampleKey = 'clue-report' | 'research-trail' | 'story-path'


const TITLES: Record<ExampleKey, string> = {
  'clue-report': 'Clue Report Example',
  'research-trail': 'Research Trail Example',
  'story-path': 'Story Path Example',
}

function ExampleModal({ type, onClose }: { type: ExampleKey; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-border flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-brand-red tracking-widest uppercase mb-0.5">Example</p>
            <h2 className="font-serif text-xl font-bold text-brand-darker">{TITLES[type]}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-brand-gray-mid hover:bg-brand-gray-lighter transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          {type === 'clue-report' && <ClueReport data={clueReportData} />}
          {type === 'research-trail' && <ResearchTrail data={researchTrailData} />}
          {type === 'story-path' && <StoryPath data={storyPathData} />}
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  exampleKey: ExampleKey
  onExampleClick: (key: ExampleKey) => void
}

function FeatureCard({ icon, title, description, exampleKey, onExampleClick }: FeatureCardProps) {
  return (
    <div className="card p-4 sm:p-6 md:p-8 flex flex-col">
      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-brand-darker mb-3">{title}</h3>
      <p className="text-brand-gray-dark leading-relaxed flex-1">{description}</p>
      <button
        onClick={() => onExampleClick(exampleKey)}
        className="mt-5 text-sm font-semibold text-brand-red hover:underline flex items-center gap-1 self-start"
      >
        See an example
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default function FeatureExamples() {
  const [activeExample, setActiveExample] = useState<ExampleKey | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={
            <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          title="Clue Report"
          description="AI extracts people, dates, places, and relationships from your clipping into a structured research profile."
          exampleKey="clue-report"
          onExampleClick={setActiveExample}
        />
        <FeatureCard
          icon={
            <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
          title="Research Trail"
          description="Get actionable next steps: where to search next, name variants to try, and surrounding records to find."
          exampleKey="research-trail"
          onExampleClick={setActiveExample}
        />
        <FeatureCard
          icon={
            <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="Story Path"
          description="Choose from 7 story formats to transform raw clues into compelling narratives about your ancestor."
          exampleKey="story-path"
          onExampleClick={setActiveExample}
        />
      </div>

      {activeExample && (
        <ExampleModal type={activeExample} onClose={() => setActiveExample(null)} />
      )}
    </>
  )
}
