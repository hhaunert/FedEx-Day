import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: clippings } = await supabase
    .from('clippings')
    .select('id, image_url, newspaper_name, newspaper_date, created_at, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-darker">Your Clippings</h1>
            <p className="text-brand-gray-dark mt-1">
              {clippings?.length ?? 0} clipping{clippings?.length !== 1 ? 's' : ''} analyzed
            </p>
          </div>
          <Link href="/analyze" className="btn-primary">
            + New Analysis
          </Link>
        </div>

        {!clippings || clippings.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-20 h-20 bg-brand-gray-lighter rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-brand-gray-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-darker mb-3">
              No clippings yet
            </h2>
            <p className="text-brand-gray-dark mb-8 max-w-md mx-auto">
              Upload your first newspaper clipping to get started with AI-powered genealogy analysis.
            </p>
            <Link href="/analyze" className="btn-primary">
              Analyze Your First Clipping
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {clippings.map((clipping) => (
              <Link
                key={clipping.id}
                href={`/result/${clipping.id}`}
                className="card overflow-hidden hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="aspect-[3/4] bg-brand-gray-lighter relative overflow-hidden">
                  {clipping.image_url ? (
                    <Image
                      src={clipping.image_url}
                      alt={clipping.newspaper_name || 'Newspaper clipping'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-brand-gray-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {clipping.status === 'pending' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="badge bg-yellow-100 text-yellow-800">Processing...</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="font-semibold text-brand-darker text-sm truncate">
                    {clipping.newspaper_name || 'Unknown Newspaper'}
                  </p>
                  <p className="text-brand-gray-mid text-xs mt-0.5 truncate">
                    {clipping.newspaper_date || 'Date unknown'}
                  </p>
                  <p className="text-brand-gray-border text-xs mt-2">
                    {new Date(clipping.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
