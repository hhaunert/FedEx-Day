'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-brand-gray-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />

          <div className="hidden sm:flex items-center gap-4">
            {loading ? null : user ? (
              <>
                <Link href="/analyze" className="btn-primary text-sm px-4 py-2">
                  New Analysis
                </Link>
                <Link href="/dashboard" className="btn-ghost text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-ghost text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-primary text-sm px-4 py-2">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-3 rounded-lg text-brand-gray-dark hover:bg-brand-gray-lighter"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden py-3 flex flex-col gap-2 border-t border-brand-gray-border">
            {!loading && user ? (
              <>
                <Link href="/analyze" className="btn-primary text-base text-center py-3" onClick={() => setMenuOpen(false)}>
                  New Analysis
                </Link>
                <Link href="/dashboard" className="btn-ghost text-base text-center py-3" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="btn-ghost text-base py-3 w-full">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-primary text-base text-center py-3" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
