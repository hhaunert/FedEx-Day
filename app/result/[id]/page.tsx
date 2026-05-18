import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ClueReport from '@/components/results/ClueReport'
import StoryPath from '@/components/results/StoryPath'
import ResearchTrail from '@/components/results/ResearchTrail'
import EditableCitation from '@/components/results/EditableCitation'

const STORY_NAMES: Record<string, string> = {
  'ancestor-life': 'The Ancestor Life Story',
  'place-story': 'The Place Story',
  'historical-context': 'The Historical Context Story',
  'day-in-the-life': 'The "Day in the Life" Story',
  'timeline': 'The Timeline Story',
  'evidence': 'The Evidence Story',
  'life-moment': 'The Life Moment Story',
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: clipping, error } = await supabase
    .from('clippings')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !clipping) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Nav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-brand-gray-mid hover:text-brand-darker transition-colors mb-3 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="font-serif text-3xl font-bold text-brand-darker">
              {clipping.newspaper_name || 'Newspaper Clipping'} Analysis
            </h1>
            {clipping.newspaper_date && (
              <p className="text-brand-gray-dark mt-1">
                {clipping.newspaper_date}
                {clipping.newspaper_page && ` · ${clipping.newspaper_page}`}
              </p>
            )}
          </div>
          <a
            href={`/api/pdf/${clipping.id}`}
            download={`newspaper-detective-${clipping.id}.pdf`}
            className="btn-primary flex-shrink-0"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: image + citation */}
          <div className="lg:col-span-1 space-y-5">
            {clipping.image_url && (
              <div className="card overflow-hidden">
                <div className="relative aspect-[3/4] bg-brand-gray-lighter">
                  <Image
                    src={clipping.image_url}
                    alt="Newspaper clipping"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <EditableCitation
              id={clipping.id}
              newspaperName={clipping.newspaper_name}
              newspaperDate={clipping.newspaper_date}
              newspaperPage={clipping.newspaper_page}
            />

            {/* Story types used */}
            {clipping.selected_story_types && clipping.selected_story_types.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-brand-darker text-sm mb-3">Stories Generated</h3>
                <div className="space-y-1.5">
                  {clipping.selected_story_types.map((slug: string) => (
                    <div key={slug} className="text-xs text-brand-gray-dark flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0"></span>
                      {STORY_NAMES[slug] || slug}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transcription */}
            {clipping.transcription && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-brand-darker mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-red rounded-full inline-block"></span>
                  Transcription
                </h2>
                <div className="bg-brand-gray-light rounded-lg p-4">
                  <p className="text-sm text-brand-gray-dark leading-relaxed whitespace-pre-wrap font-serif">
                    {clipping.transcription}
                  </p>
                </div>
              </div>
            )}

            {/* Clue Report */}
            {clipping.clue_report && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-brand-darker mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-red rounded-full inline-block"></span>
                  Clue Report
                </h2>
                <ClueReport data={clipping.clue_report} />
              </div>
            )}

            {/* Story Path */}
            {clipping.story_path && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-brand-darker mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-red rounded-full inline-block"></span>
                  Story Path
                </h2>
                <StoryPath data={clipping.story_path} />
              </div>
            )}

            {/* Research Trail */}
            {clipping.research_trail && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-brand-darker mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-red rounded-full inline-block"></span>
                  Research Trail
                </h2>
                <ResearchTrail data={clipping.research_trail} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
