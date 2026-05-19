import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ClueReport from '@/components/results/ClueReport'
import StoryPath from '@/components/results/StoryPath'
import ResearchTrail from '@/components/results/ResearchTrail'
import EditableCitation from '@/components/results/EditableCitation'
import EditableDetails from '@/components/results/EditableDetails'
import AddStories from '@/components/results/AddStories'
import ExpandableSection from '@/components/results/ExpandableSection'
import BuildPdfButton from '@/components/results/BuildPdfButton'
import RerunAnalysisButton from '@/components/results/RerunAnalysisButton'


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
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-brand-gray-mid hover:text-brand-darker transition-colors mb-3 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-darker">
                {clipping.title || clipping.newspaper_name || 'Newspaper Clipping'}
              </h1>
              {(clipping.newspaper_date || clipping.newspaper_page) && (
                <p className="text-brand-gray-dark mt-1 text-sm sm:text-base">
                  {clipping.newspaper_date}
                  {clipping.newspaper_page && ` · ${clipping.newspaper_page}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <RerunAnalysisButton id={clipping.id} />
              <BuildPdfButton id={clipping.id} />
            </div>
          </div>
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
              title={clipping.title}
              newspaperName={clipping.newspaper_name}
              newspaperDate={clipping.newspaper_date}
              newspaperPage={clipping.newspaper_page}
              newspaperState={clipping.newspaper_state}
            />

            <EditableDetails
              id={clipping.id}
              userDetails={clipping.user_details}
            />

          </div>

          {/* Right column: reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clue Report */}
            {clipping.clue_report && (
              <ExpandableSection
                title="Clue Report"
                subtitle={[
                  clipping.clue_report.people?.length && `${clipping.clue_report.people.length} ${clipping.clue_report.people.length === 1 ? 'person' : 'people'} identified`,
                  clipping.clue_report.places?.length && `${clipping.clue_report.places.length} ${clipping.clue_report.places.length === 1 ? 'place' : 'places'} found`,
                  clipping.clue_report.research_value && `${clipping.clue_report.research_value} research value`,
                ].filter(Boolean).join(' · ') || 'Genealogical facts extracted from the clipping'}
                buttonLabel="View Clues"
              >
                <ClueReport data={clipping.clue_report} />
              </ExpandableSection>
            )}

            {/* Research Trail */}
            {clipping.research_trail && (
              <ExpandableSection
                title="Research Trail"
                subtitle={[
                  clipping.research_trail.searches?.length && `${clipping.research_trail.searches.length} searches suggested`,
                  clipping.research_trail.tips?.length && `${clipping.research_trail.tips.length} tips`,
                ].filter(Boolean).join(' · ') || 'Newspaper search recommendations'}
                buttonLabel="View Trail"
              >
                <ResearchTrail data={clipping.research_trail} />
              </ExpandableSection>
            )}

            {/* Story Path */}
            {clipping.story_path?.stories?.length > 0 && (
              <ExpandableSection
                title="Story Path"
                subtitle={`${clipping.story_path.stories.length} ${clipping.story_path.stories.length === 1 ? 'story' : 'stories'} generated`}
                buttonLabel="Read Stories"
              >
                <StoryPath data={clipping.story_path} />
              </ExpandableSection>
            )}

            <AddStories
              id={clipping.id}
              existingSlugs={clipping.selected_story_types || []}
            />

            {/* Transcription */}
            {clipping.transcription && (
              <ExpandableSection
                title="Transcription"
                subtitle="Full text extracted from the clipping"
                buttonLabel="Read Text"
              >
                <div className="bg-brand-gray-light rounded-lg p-4">
                  <p className="text-sm text-brand-gray-dark leading-relaxed whitespace-pre-wrap font-serif">
                    {clipping.transcription}
                  </p>
                </div>
              </ExpandableSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
