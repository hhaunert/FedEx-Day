'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Nav from '@/components/Nav'

const SAMPLE_PAGE_IDS = [5225, 5226, 5227, 5228, 5229]

interface ChurchRecord {
  id: string
  record_number: string
  date_of_death: string
  time_of_death: string
  name: string
  age_raw: string
  age_years: number | null
  age_months: number | null
  age_days: number | null
  survivors: string
  burial_date: string
  pastor: string
  source_page_id: number
  source_image_url: string
}

export default function ChurchRecordsPage() {
  const [records, setRecords] = useState<ChurchRecord[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [ingesting, setIngesting] = useState(false)
  const [ingestStatus, setIngestStatus] = useState<string | null>(null)
  const [selected, setSelected] = useState<ChurchRecord | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchRecords = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/church-records?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setRecords(data.records ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords('')
  }, [fetchRecords])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchRecords(value), 300)
  }

  const handleIngest = async () => {
    setIngesting(true)
    setIngestStatus('Fetching pages and transcribing with Claude Vision — this may take 30–60 seconds...')
    try {
      const res = await fetch('/api/church-records/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_ids: SAMPLE_PAGE_IDS }),
      })
      const data = await res.json()
      if (data.error) {
        setIngestStatus(`Error: ${data.error}`)
      } else {
        const skipped = data.results.filter((r: { skipped: boolean }) => r.skipped).length
        const newPages = SAMPLE_PAGE_IDS.length - skipped
        const msg = newPages === 0
          ? 'These pages were already processed — showing existing records.'
          : `Extracted ${data.totalInserted} records from ${newPages} new page${newPages !== 1 ? 's' : ''}.`
        setIngestStatus(msg)
        await fetchRecords(query)
      }
    } catch {
      setIngestStatus('Failed to process pages. Please try again.')
    } finally {
      setIngesting(false)
    }
  }

  const handleRowClick = (r: ChurchRecord) => {
    setSelected(prev => prev?.id === r.id ? null : r)
  }

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-darker">
            Zion Evangelical Church — Death Register
          </h1>
          <p className="text-brand-gray-dark mt-1">
            Kirchenbuch der Deutsch Ev. Zions Gemeine in Cincinnati · 1872–1934 ·{' '}
            <a
              href="https://cdm16998.contentdm.oclc.org/digital/collection/p16998coll55/id/5227/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              Source collection
            </a>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by name, date, survivors..."
            className="input-field flex-1"
          />
          <button
            onClick={handleIngest}
            disabled={ingesting}
            className="btn-primary whitespace-nowrap"
          >
            {ingesting ? 'Processing...' : 'Process Sample Pages'}
          </button>
        </div>

        {ingestStatus && (
          <p className="text-sm text-brand-gray-dark mb-4 italic">{ingestStatus}</p>
        )}

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-brand-gray-mid">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-serif text-lg text-brand-gray-dark mb-2">No records found</p>
              <p className="text-sm text-brand-gray-mid">
                {query
                  ? 'Try a different search term.'
                  : 'Click "Process Sample Pages" to extract records from 5 pages using Claude Vision.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-gray-lighter border-b border-brand-gray-border">
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark w-16">No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark">Date of Death</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark hidden md:table-cell">Age</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark hidden lg:table-cell">Survivors</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark hidden md:table-cell">Burial Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-gray-dark w-20">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-border">
                  {records.map(r => (
                    <tr
                      key={r.id}
                      onClick={() => handleRowClick(r)}
                      className={`cursor-pointer transition-colors ${
                        selected?.id === r.id
                          ? 'bg-red-50'
                          : 'hover:bg-brand-gray-lighter'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brand-gray-dark">{r.record_number}</td>
                      <td className="px-4 py-3 font-medium text-brand-darker">{r.name}</td>
                      <td className="px-4 py-3 text-brand-gray-dark">{r.date_of_death}</td>
                      <td className="px-4 py-3 text-brand-gray-dark hidden md:table-cell">{r.age_raw || '—'}</td>
                      <td className="px-4 py-3 text-brand-gray-dark hidden lg:table-cell max-w-xs truncate">{r.survivors || '—'}</td>
                      <td className="px-4 py-3 text-brand-gray-dark hidden md:table-cell">{r.burial_date || '—'}</td>
                      <td className="px-4 py-3">
                        <a
                          href={r.source_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-brand-red hover:underline text-xs"
                        >
                          View page →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {records.length > 0 && (
          <p className="text-xs text-brand-gray-mid mt-2">
            {records.length} record{records.length !== 1 ? 's' : ''}{query ? ' matching search' : ''}
          </p>
        )}

        {selected && (
          <div className="card mt-6 p-6">
            <div className="flex justify-between items-start mb-5">
              <h2 className="font-serif text-xl font-bold text-brand-darker">
                Record {selected.record_number} — {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-brand-gray-mid hover:text-brand-darker text-xl leading-none ml-4 flex-shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-5">
              {([
                ['Date of Death', selected.date_of_death],
                ['Time of Death', selected.time_of_death || '—'],
                ['Age', selected.age_raw || '—'],
                ['Burial Date', selected.burial_date || '—'],
                ['Survivors', selected.survivors || '—'],
                ['Pastor', selected.pastor || '—'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gray-mid">{label}</dt>
                  <dd className="text-brand-darker mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={selected.source_image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-red hover:underline"
            >
              View source page in CONTENTdm →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
