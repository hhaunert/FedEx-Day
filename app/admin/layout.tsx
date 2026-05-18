import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <nav className="bg-brand-darker text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" href="/" />
            <span className="text-white/40">|</span>
            <span className="text-sm font-medium text-white/80">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/copy" className="text-white/80 hover:text-white transition-colors">
              Copy
            </Link>
            <Link href="/admin/stories" className="text-white/80 hover:text-white transition-colors">
              Stories
            </Link>
            <Link href="/admin/prompts" className="text-white/80 hover:text-white transition-colors">
              Prompts
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
