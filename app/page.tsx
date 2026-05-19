import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import DashboardLink from '@/components/DashboardLink'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import FeatureExamples from '@/components/FeatureExamples'
import FAQ from '@/components/FAQ'

const defaultContent = {
  hero_headline: 'Uncover the Stories Hidden in Your Newspaper Clippings',
  hero_subheadline: 'Stop wondering who they were. Start finding out.',
  cta_primary: 'Crack Your First Case →',
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


export default async function HomePage() {
  const content = defaultContent
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { count } = await adminClient.from('clippings').select('*', { count: 'exact', head: true })


  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="relative border-b border-brand-gray-border overflow-hidden">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[left_40%] xl:object-[-60%_40%]"
        />
        <div className="absolute inset-0 bg-brand-gray-light/50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-darker leading-tight mb-6">
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

          {count !== null && count > 0 && (
            <div className="mt-8">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-brand-darker">{count.toLocaleString()}</p>
              <p className="text-sm text-brand-gray-dark mt-3 uppercase tracking-widest">clippings analyzed</p>
            </div>
          )}
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
            One clipping. Three research reports. Instant results.
          </p>
        </div>

        <FeatureExamples />
      </section>

      {/* How it works */}
      <section className="bg-brand-gray-light border-t border-brand-gray-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-darker mb-4">
              How It Works
            </h2>
            <p className="text-brand-gray-dark text-lg max-w-xl mx-auto">
              From clipping to research report in four simple steps.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-9 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-0.5 bg-brand-gray-border" aria-hidden="true" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {[
                {
                  step: '1',
                  title: 'Upload',
                  desc: 'Upload a photo or scan of any newspaper clipping and we\'ll handle the rest.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  ),
                },
                {
                  step: '2',
                  title: 'Review Details',
                  desc: 'Verify the clipping details and make any corrections before analysis begins.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                },
                {
                  step: '3',
                  title: 'Choose Stories',
                  desc: 'Select from 7 narrative styles to shape how your ancestor\'s story gets told.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  ),
                },
                {
                  step: '4',
                  title: 'Build Your PDF',
                  desc: 'Build your PDF your way. Pick the sections that matter most to your research.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                },
              ].map(({ step, title, desc, icon }, i, arr) => (
                <div key={step} className="flex flex-col items-center text-center relative">
                  {/* Arrow between steps — mobile/tablet (sm grid) */}
                  {i < arr.length - 1 && (
                    <div className="sm:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-brand-gray-border text-xl leading-none" aria-hidden="true">↓</div>
                  )}
                  {/* Icon circle */}
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-brand-red shadow-md flex items-center justify-center mb-5 ring-4 ring-brand-gray-light">
                    {icon}
                  </div>
                  <h3 className="font-serif font-bold text-brand-darker text-lg mb-2">{title}</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed max-w-[180px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/analyze" className="btn-primary text-base px-8 py-4">
              Analyze a Clipping
            </Link>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Footer */}
      <footer className="border-t border-brand-gray-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-gray-mid">
          <p>© {new Date().getFullYear()} NewspaperArchive. All rights reserved.</p>
          <div className="flex gap-6">
            {user ? (
              <DashboardLink className="hover:text-brand-darker transition-colors">Dashboard</DashboardLink>
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
