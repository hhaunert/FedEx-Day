import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const [{ count: clippingCount }, { count: userCount }] = await Promise.all([
    supabase.from('clippings').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    {
      title: 'Copy & Content',
      description: 'Edit hero headline, subheadline, feature descriptions, and other site copy.',
      href: '/admin/copy',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Story Types',
      description: 'Manage the 7 story types: names, descriptions, and AI generation prompts.',
      href: '/admin/stories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'AI Prompts',
      description: 'Edit system prompts for Clue Report and Research Trail generation.',
      href: '/admin/prompts',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-darker">Admin Dashboard</h1>
        <p className="text-brand-gray-dark mt-1">Manage content, stories, and AI prompts.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm text-brand-gray-mid mb-1">Total Clippings Analyzed</p>
          <p className="font-serif text-4xl font-bold text-brand-darker">{clippingCount ?? '—'}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-brand-gray-mid mb-1">Registered Users</p>
          <p className="font-serif text-4xl font-bold text-brand-darker">{userCount ?? '—'}</p>
        </div>
      </div>

      {/* Admin sections */}
      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card p-6 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 bg-red-50 text-brand-red rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
              {card.icon}
            </div>
            <h2 className="font-serif text-lg font-bold text-brand-darker mb-2">{card.title}</h2>
            <p className="text-sm text-brand-gray-dark">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
