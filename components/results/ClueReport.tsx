'use client'

interface Person {
  name: string
  role?: string
  approximate_age?: string
  relationship_to_subject?: string
}

interface DateEntry {
  date: string
  event: string
  certainty?: string
}

interface Place {
  name: string
  type?: string
  context?: string
}

interface Relationship {
  person1: string
  person2: string
  relationship: string
}

interface Occupation {
  person: string
  occupation: string
}

interface Event {
  type: string
  description: string
  date?: string
  location?: string
}

interface ClueReportData {
  people?: Person[]
  dates?: DateEntry[]
  places?: Place[]
  relationships?: Relationship[]
  occupations?: Occupation[]
  events?: Event[]
  key_facts?: string[]
  research_value?: string
  notes?: string
  raw?: string
}

interface ClueReportProps {
  data: ClueReportData
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-brand-darker text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-red rounded-full inline-block"></span>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function ClueReport({ data }: ClueReportProps) {
  if (data.raw) {
    return (
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-brand-gray-dark">{data.raw}</pre>
      </div>
    )
  }

  const researchValueColor = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  }[data.research_value?.toLowerCase() || 'medium'] || 'bg-gray-100 text-gray-600'

  return (
    <div className="space-y-6">
      {data.research_value && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-gray-dark">Research Value:</span>
          <span className={`badge capitalize ${researchValueColor}`}>
            {data.research_value}
          </span>
        </div>
      )}

      {data.people && data.people.length > 0 && (
        <Section title="People">
          <div className="space-y-3">
            {data.people.map((person, i) => (
              <div key={i} className="bg-brand-gray-light rounded-lg p-4">
                <p className="font-semibold text-brand-darker">{person.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-gray-dark">
                  {person.role && <span>Role: {person.role}</span>}
                  {person.approximate_age && <span>Age: {person.approximate_age}</span>}
                  {person.relationship_to_subject && <span>Relationship: {person.relationship_to_subject}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.dates && data.dates.length > 0 && (
        <Section title="Dates & Events">
          <div className="space-y-2">
            {data.dates.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-brand-red font-mono text-sm flex-shrink-0 mt-0.5">{d.date}</span>
                <span className="text-brand-gray-dark text-sm">{d.event}</span>
                {d.certainty && d.certainty !== 'exact' && (
                  <span className="text-xs text-brand-gray-mid flex-shrink-0 mt-0.5">({d.certainty})</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.places && data.places.length > 0 && (
        <Section title="Places">
          <div className="flex flex-wrap gap-2">
            {data.places.map((place, i) => (
              <div key={i} className="bg-brand-gray-light rounded-lg px-3 py-2">
                <span className="font-medium text-brand-darker text-sm">{place.name}</span>
                {place.context && (
                  <span className="text-brand-gray-mid text-xs ml-2">({place.context})</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.relationships && data.relationships.length > 0 && (
        <Section title="Relationships">
          <div className="space-y-2">
            {data.relationships.map((rel, i) => (
              <div key={i} className="text-sm text-brand-gray-dark flex items-center gap-2">
                <span className="font-medium text-brand-darker">{rel.person1}</span>
                <span className="text-brand-gray-mid">is {rel.relationship} of</span>
                <span className="font-medium text-brand-darker">{rel.person2}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.occupations && data.occupations.length > 0 && (
        <Section title="Occupations">
          <div className="space-y-2">
            {data.occupations.map((occ, i) => (
              <div key={i} className="text-sm flex items-center gap-2">
                <span className="font-medium text-brand-darker">{occ.person}:</span>
                <span className="text-brand-gray-dark">{occ.occupation}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.key_facts && data.key_facts.length > 0 && (
        <Section title="Key Facts">
          <ul className="space-y-1.5">
            {data.key_facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-gray-dark">
                <span className="text-brand-red mt-1 flex-shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.notes && (
        <Section title="Analyst Notes">
          <p className="text-sm text-brand-gray-dark leading-relaxed italic">{data.notes}</p>
        </Section>
      )}
    </div>
  )
}
