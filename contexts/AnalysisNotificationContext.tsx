'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'

interface Notification {
  id: string
}

interface ContextValue {
  notifications: Notification[]
  clearNotifications: () => void
  startAnalysis: (formData: FormData, onSuccess: (id: string) => void, onError: (msg: string) => void) => void
  cancelRedirect: () => void
}

const AnalysisNotificationContext = createContext<ContextValue>({
  notifications: [],
  clearNotifications: () => {},
  startAnalysis: () => {},
  cancelRedirect: () => {},
})

export function AnalysisNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  // Stores the page's redirect callback. Cleared when the page unmounts.
  const redirectCallbackRef = useRef<((id: string) => void) | null>(null)
  const errorCallbackRef = useRef<((msg: string) => void) | null>(null)

  const startAnalysis = useCallback((
    formData: FormData,
    onSuccess: (id: string) => void,
    onError: (msg: string) => void,
  ) => {
    redirectCallbackRef.current = onSuccess
    errorCallbackRef.current = onError

    fetch('/api/analyze', { method: 'POST', body: formData })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const msg = data.error || 'Analysis failed. Please try again.'
          if (errorCallbackRef.current) {
            errorCallbackRef.current(msg)
          }
          return
        }
        const { id } = await res.json()
        if (redirectCallbackRef.current) {
          redirectCallbackRef.current(id)
        } else {
          setNotifications((prev) => [...prev, { id }])
        }
      })
      .catch(() => {
        if (errorCallbackRef.current) {
          errorCallbackRef.current('Analysis failed. Please try again.')
        }
      })
  }, [])

  const cancelRedirect = useCallback(() => {
    redirectCallbackRef.current = null
    errorCallbackRef.current = null
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <AnalysisNotificationContext.Provider value={{ notifications, clearNotifications, startAnalysis, cancelRedirect }}>
      {children}
    </AnalysisNotificationContext.Provider>
  )
}

export function useAnalysisNotifications() {
  return useContext(AnalysisNotificationContext)
}
