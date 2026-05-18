import Link from 'next/link'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'

const defaultContent = {
  hero_headline: 'Uncover the Stories Hidden in Your Newspaper Clippings',
  hero_subheadline:
    'AI-powered analysis transforms old newspaper clippings into rich family histories, research trails, and compelling ancestor stories.',
  cta_primary: 'Analyze a Clipping',
  feature_clue_report_title: 'Clue Report',
  feature_clue_report_desc:
    'AI extracts people, dates, places, and relationships from your clipping into a structured research profile.',
  feature_story_path_title: 'Story Path',
  feature_story_path_desc:
    'Choose from 7 story formats to transform raw clues into compelling narratives about your ancestor.',
  feature_research_trail_title: 'Research Trail',
  feature_research_trail_desc:
    'Get actionable next steps: where to search next, name variants to try, and surrounding records to find.',
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card p-8">
      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-brand-darker mb-3">{title}</h3>
      <p className="text-brand-gray-dark leading-relaxed">{description}</p>
    </div>
  )
}

export default async function HomePage() {
  const content = defaultContent
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="bg-brand-gray-light border-b border-brand-gray-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-brand-gray-border rounded-full px-4 py-2 mb-8 text-sm text-brand-gray-dark">
            <span className="w-2 h-2 rounded-full bg-brand-red inline-block"></span>
            Powered by NewspaperArchive &amp; Claude AI
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-darker leading-tight mb-6">
            {content.hero_headline}
          </h1>

          <p className="text-lg sm:text-xl text-brand-gray-dark max-w-3xl mx-auto leading-relaxed mb-10">
            {content.hero_subheadline}
          </p>

          <div className="flex items-center justify-center">
            <Link href="/analyze" className="btn-primary text-base px-8 py-4">
              {content.cta_primary}
            </Link>
          </div>
        </div>
      </section>

      {/* Newspaper rule decoration */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <hr className="newspaper-rule" />
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-darker mb-4">
            Three Powerful Reports from Every Clipping
          </h2>
          <p className="text-brand-gray-dark text-lg max-w-2xl mx-auto">
            Upload any newspaper clipping and our AI generates three distinct research outputs instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            title={content.feature_clue_report_title}
            description={content.feature_clue_report_desc}
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title={content.feature_story_path_title}
            description={content.feature_story_path_desc}
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
            title={content.feature_research_trail_title}
            description={content.feature_research_trail_desc}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-gray-light border-t border-brand-gray-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-darker mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Upload', desc: 'Drop in your newspaper clipping image' },
              { step: '2', title: 'Review', desc: 'AI reads the newspaper name, date, and page' },
              { step: '3', title: 'Choose', desc: 'Select 1–3 story types for your analysis' },
              { step: '4', title: 'Download', desc: 'Get your full research report as a PDF' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-red text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-brand-darker mb-2">{title}</h3>
                <p className="text-sm text-brand-gray-dark">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/analyze" className="btn-primary text-base px-8 py-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-gray-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-gray-mid">
          <p>© {new Date().getFullYear()} NewspaperArchive. All rights reserved.</p>
          <div className="flex gap-6">
            {user ? (
              <Link href="/dashboard" className="hover:text-brand-darker transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth" className="hover:text-brand-darker transition-colors">Sign In</Link>
            )}
            <Link href="/analyze" className="hover:text-brand-darker transition-colors">Analyze</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
