'use client'

interface Search {
  priority: number
  what: string
  where: string
}

interface NameVariant {
  name: string
  try_also: string[]
  // legacy fields
  original?: string
  variants?: string[]
  reason?: string
}

interface ResearchTrailData {
  searches?: Search[]
  name_variants?: NameVariant[]
  nearby_places?: string[]
  tips?: string[]
  // legacy fields
  next_searches?: Array<{ record_type: string; repository: string; search_terms?: string; why?: string; priority?: string }>
  surrounding_areas?: Array<{ location: string; why_important?: string }>
  quick_wins?: string[]
  time_period_tips?: string[]
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
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        The AI returned an unstructured response for this section. Try re-analyzing the clipping for a formatted result.
      </div>
    )
  }

  // Normalize legacy structure to new structure
  const searches: Search[] = data.searches || data.next_searches?.map((s, i) => ({
    priority: i + 1,
    what: s.record_type,
    where: s.repository,
  })) || []

  const nameVariants: NameVariant[] = data.name_variants || []

  const nearbyPlaces: string[] = data.nearby_places ||
    data.surrounding_areas?.map(a => a.location) || []

  const tips: string[] = data.tips || data.time_period_tips || data.quick_wins || []

  const hasSearches = searches.length > 0
  const hasVariants = nameVariants.length > 0
  const hasPlaces = nearbyPlaces.length > 0
  const hasTips = tips.length > 0

  if (!hasSearches && !hasVariants && !hasPlaces && !hasTips) {
    return <p className="text-sm text-brand-gray-mid">No research trail data available.</p>
  }

  return (
    <div className="space-y-10">

      {hasSearches && (
        <div>
          <SectionHeading>Where to Search Next</SectionHeading>
          <ol className="space-y-4">
            {searches.map((search, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {search.priority || i + 1}
                </span>
                <div>
                  <p className="font-semibold text-brand-darker text-sm leading-snug">{search.what}</p>
                  <p className="text-brand-gray-dark text-sm mt-0.5">{search.where}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasVariants && (
        <div>
          <SectionHeading>Name Variants to Try</SectionHeading>
          <div className="space-y-3">
            {nameVariants.map((v, i) => {
              const name = v.name || v.original || ''
              const alts = v.try_also || v.variants || []
              return (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-brand-darker text-sm">{name}</span>
                  <span className="text-brand-gray-mid text-sm">→</span>
                  {alts.map((alt, ai) => (
                    <span key={ai} className="text-xs bg-brand-gray-light border border-brand-gray-border rounded-full px-3 py-0.5 text-brand-darker">
                      {alt}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {hasPlaces && (
        <div>
          <SectionHeading>Nearby Places to Also Search</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {nearbyPlaces.map((place, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-brand-darker bg-brand-gray-light border border-brand-gray-border rounded-full px-3 py-1">
                <svg className="w-3 h-3 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {place}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasTips && (
        <div>
          <SectionHeading>Research Tips</SectionHeading>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-darker leading-relaxed">
                <span className="flex-shrink-0 text-brand-red font-bold mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
