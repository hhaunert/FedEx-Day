import { Suspense } from 'react'
import AuthConfirmClient from './AuthConfirmClient'

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-gray-light flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-brand-red" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">Verifying your link...</h2>
          <p className="text-brand-gray-dark">Please wait a moment.</p>
        </div>
      </div>
    }>
      <AuthConfirmClient />
    </Suspense>
  )
}
