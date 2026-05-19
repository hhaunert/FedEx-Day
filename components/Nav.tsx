'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { createClient } from '@/lib/supabase/client'
import { useAnalysisNotification } from '@/context/AnalysisNotification'
import type { User } from '@supabase/supabase-js'

function FingerprintBadge() {
  return (
    <span className="absolute -top-2 -right-3 pointer-events-none">
      <span className="absolute inset-0 rounded-full bg-brand-red opacity-25 animate-ping" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="relative w-4 h-4 text-brand-red"
        style={{ filter: 'drop-shadow(0 0 5px rgba(220,38,38,0.85))' }}
      >
        <path d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268" />
        <path d="M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993" />
        <path d="M10.236 6.524a3.75 3.75 0 015.28 5.28" />
        <path d="M7.989 17.052A11.209 11.209 0 018.25 10.5a3.75 3.75 0 013.75-3.75c.527 0 1.03.109 1.487.304" />
        <path d="M12 10.5a14.94 14.94 0 01-3.6 9.75" />
        <path d="M16.153 13.307a18.666 18.666 0 01-2.485 5.33" />
        <path d="M12 10.5c0 .527-.021 1.049-.064 1.565" />
      </svg>
    </span>
  )
}

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { hasNotification } = useAnalysisNotification()

  useEffect(() => {
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
                <span className="relative inline-flex">
                  <Link href="/dashboard" className="btn-ghost text-sm">
                    Dashboard
                  </Link>
                  {hasNotification && <FingerprintBadge />}
                </span>
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
            className="sm:hidden p-2 rounded-lg text-brand-gray-dark hover:bg-brand-gray-lighter"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="sm:hidden pb-4 flex flex-col gap-2">
            {!loading && user ? (
              <>
                <Link href="/analyze" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                  New Analysis
                </Link>
                <span className="relative inline-flex justify-center">
                  <Link href="/dashboard" className="btn-ghost text-sm text-center" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  {hasNotification && <FingerprintBadge />}
                </span>
                <button onClick={handleSignOut} className="btn-ghost text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
