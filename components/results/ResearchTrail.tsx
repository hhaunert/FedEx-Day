'use client'

interface NextSearch {
  record_type: string
  repository: string
  search_terms: string
  why: string
  priority: 'high' | 'medium' | 'low'
}

interface SurroundingArea {
  location: string
  why_important: string
  records_to_check: string[]
}

interface NameVariant {
  original: string
  variants: string[]
  reason: string
}

interface ResearchTrailData {
  next_searches?: NextSearch[]
  surrounding_areas?: SurroundingArea[]
  name_variants?: NameVariant[]
  time_period_tips?: string[]
  quick_wins?: string[]
  long_term_strategies?: string[]
  raw?: string
}

interface ResearchTrailProps {
  data: ResearchTrailData
}

const priorityBadge = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-brand-darker flex items-center gap-2 mb-4">
        <span className="text-brand-red">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function ResearchTrail({ data }: ResearchTrailProps) {
  if (data.raw) {
    return (
      <pre className="whitespace-pre-wrap text-sm text-brand-gray-dark">{data.raw}</pre>
    )
  }

  return (
    <div className="space-y-8">
      {data.quick_wins && data.quick_wins.length > 0 && (
        <Section
          title="Quick Wins"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          <ul className="space-y-2">
            {data.quick_wins.map((win, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-gray-dark">
                <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                {win}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.next_searches && data.next_searches.length > 0 && (
        <Section
          title="Next Searches"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        >
          <div className="space-y-4">
            {data.next_searches.map((search, i) => (
              <div key={i} className="bg-brand-gray-light rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-brand-darker text-sm">{search.record_type}</p>
                  <span className={`badge capitalize flex-shrink-0 ${priorityBadge[search.priority] || priorityBadge.medium}`}>
                    {search.priority}
                  </span>
                </div>
                <p className="text-sm text-brand-gray-dark">
                  <span className="font-medium text-brand-gray-dark">Where:</span> {search.repository}
                </p>
                <p className="text-sm text-brand-gray-dark">
                  <span className="font-medium">Search for:</span>{' '}
                  <span className="font-mono bg-white rounded px-1 py-0.5 border border-brand-gray-border text-xs">
                    {search.search_terms}
                  </span>
                </p>
                <p className="text-sm text-brand-gray-mid italic">{search.why}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.name_variants && data.name_variants.length > 0 && (
        <Section
          title="Name Variants to Try"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        >
          <div className="space-y-3">
            {data.name_variants.map((variant, i) => (
              <div key={i} className="bg-brand-gray-light rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-brand-darker text-sm">{variant.original}</span>
                  <span className="text-brand-gray-mid text-sm">→</span>
                  {variant.variants.map((v, vi) => (
                    <span key={vi} className="badge bg-white border border-brand-gray-border text-brand-darker text-xs">
                      {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-brand-gray-mid">{variant.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.surrounding_areas && data.surrounding_areas.length > 0 && (
        <Section
          title="Surrounding Areas to Check"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          <div className="space-y-4">
            {data.surrounding_areas.map((area, i) => (
              <div key={i} className="bg-brand-gray-light rounded-xl p-4">
                <p className="font-semibold text-brand-darker text-sm mb-1">{area.location}</p>
                <p className="text-sm text-brand-gray-dark mb-2">{area.why_important}</p>
                {area.records_to_check && area.records_to_check.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {area.records_to_check.map((rec, ri) => (
                      <span key={ri} className="text-xs bg-white border border-brand-gray-border rounded px-2 py-0.5 text-brand-gray-dark">
                        {rec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.time_period_tips && data.time_period_tips.length > 0 && (
        <Section
          title="Tips for This Time Period"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <ul className="space-y-2">
            {data.time_period_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-gray-dark">
                <span className="text-brand-red mt-1 flex-shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.long_term_strategies && data.long_term_strategies.length > 0 && (
        <Section
          title="Long-Term Research Strategies"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        >
          <ul className="space-y-2">
            {data.long_term_strategies.map((strategy, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-gray-dark">
                <span className="text-brand-mid-dark mt-1 flex-shrink-0">◆</span>
                {strategy}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
