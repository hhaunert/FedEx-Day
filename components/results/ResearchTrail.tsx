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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4 pb-2 border-b border-brand-gray-border">
      {children}
    </h3>
  )
}

export default function ResearchTrail({ data }: ResearchTrailProps) {
  if (data.raw) {
    return <pre className="whitespace-pre-wrap text-sm text-brand-gray-dark leading-relaxed">{data.raw}</pre>
  }

  const hasQuickWins = data.quick_wins && data.quick_wins.length > 0
  const hasSearches = data.next_searches && data.next_searches.length > 0
  const hasVariants = data.name_variants && data.name_variants.length > 0
  const hasAreas = data.surrounding_areas && data.surrounding_areas.length > 0
  const hasTips = data.time_period_tips && data.time_period_tips.length > 0
  const hasStrategies = data.long_term_strategies && data.long_term_strategies.length > 0

  return (
    <div className="space-y-10">

      {hasQuickWins && (
        <div>
          <SectionHeading>Start Here</SectionHeading>
          <ol className="space-y-3">
            {data.quick_wins!.map((win, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-brand-darker text-sm leading-relaxed">{win}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasSearches && (
        <div>
          <SectionHeading>Searches to Run</SectionHeading>
          <ol className="space-y-5">
            {data.next_searches!.map((search, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {(data.quick_wins?.length || 0) + i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-darker font-semibold text-sm">{search.record_type}</p>
                  <p className="text-brand-gray-dark text-sm mt-0.5">
                    <span className="font-medium">Where:</span> {search.repository}
                  </p>
                  {search.search_terms && (
                    <p className="text-brand-gray-dark text-sm mt-0.5">
                      <span className="font-medium">Search for:</span>{' '}
                      <span className="italic">{search.search_terms}</span>
                    </p>
                  )}
                  <p className="text-brand-gray-mid text-xs mt-1">{search.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasVariants && (
        <div>
          <SectionHeading>Name Variants to Try</SectionHeading>
          <div className="space-y-4">
            {data.name_variants!.map((variant, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-brand-darker text-sm">{variant.original}</span>
                  <span className="text-brand-gray-mid text-sm">→</span>
                  {variant.variants.map((v, vi) => (
                    <span key={vi} className="text-xs bg-brand-gray-light border border-brand-gray-border rounded-full px-3 py-0.5 text-brand-darker">
                      {v}
                    </span>
                  ))}
                </div>
                {variant.reason && (
                  <p className="text-xs text-brand-gray-mid pl-0">{variant.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasAreas && (
        <div>
          <SectionHeading>Surrounding Areas to Check</SectionHeading>
          <ul className="space-y-3">
            {data.surrounding_areas!.map((area, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 text-brand-red mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <span className="font-semibold text-brand-darker text-sm">{area.location}</span>
                  {area.why_important && (
                    <span className="text-brand-gray-dark text-sm"> — {area.why_important}</span>
                  )}
                  {area.records_to_check && area.records_to_check.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {area.records_to_check.map((rec, ri) => (
                        <span key={ri} className="text-xs bg-brand-gray-light border border-brand-gray-border rounded px-2 py-0.5 text-brand-gray-dark">
                          {rec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasTips && (
        <div>
          <SectionHeading>Tips for This Era</SectionHeading>
          <ul className="space-y-3">
            {data.time_period_tips!.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-darker leading-relaxed">
                <span className="flex-shrink-0 text-brand-red font-bold mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasStrategies && (
        <div>
          <SectionHeading>Long-Term Strategies</SectionHeading>
          <ul className="space-y-3">
            {data.long_term_strategies!.map((strategy, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-darker leading-relaxed">
                <span className="flex-shrink-0 text-brand-gray-mid font-bold mt-0.5">◆</span>
                {strategy}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
