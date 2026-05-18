import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ClippingsGrid from '@/components/dashboard/ClippingsGrid'

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
    .select('id, title, image_url, newspaper_name, newspaper_date, created_at, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-darker">Your Clippings</h1>
            <p className="text-brand-gray-dark mt-1">
              {clippings?.length ?? 0} clipping{clippings?.length !== 1 ? 's' : ''} analyzed
            </p>
          </div>
          <Link href="/analyze" className="btn-primary self-start sm:self-auto">
            + New Analysis
          </Link>
        </div>

        <ClippingsGrid clippings={clippings ?? []} />
      </div>
    </div>
  )
}
