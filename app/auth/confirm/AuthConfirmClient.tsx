'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleConfirm = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus('error')
        setMessage(error.message)
        return
      }

      if (data.session) {
        setStatus('success')
        setMessage('Signed in successfully! Redirecting...')
        const redirectTo = searchParams.get('redirectTo') || '/dashboard'
        setTimeout(() => router.push(redirectTo), 1500)
        return
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus('success')
          setMessage('Signed in successfully! Redirecting...')
          const redirectTo = searchParams.get('redirectTo') || '/dashboard'
          setTimeout(() => router.push(redirectTo), 1500)
          subscription.unsubscribe()
        } else if (event === 'TOKEN_REFRESHED') {
          // ignore
        } else if (!session && event !== 'INITIAL_SESSION') {
          setStatus('error')
          setMessage('The magic link may have expired. Please try signing in again.')
          subscription.unsubscribe()
        }
      })

      const timeout = setTimeout(() => {
        setStatus('error')
        setMessage('Could not verify your sign-in link. Please try again.')
        subscription.unsubscribe()
      }, 10000)

      return () => {
        clearTimeout(timeout)
        subscription.unsubscribe()
      }
    }

    handleConfirm()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-brand-gray-light flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="animate-spin w-8 h-8 text-brand-red" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">Verifying your link...</h2>
            <p className="text-brand-gray-dark">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">You&apos;re signed in!</h2>
            <p className="text-brand-gray-dark">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">Sign-in failed</h2>
            <p className="text-brand-gray-dark mb-6">{message}</p>
            <a href="/auth" className="btn-primary">
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  )
}
