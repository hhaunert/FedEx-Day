'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'analysis_notification'

interface NotificationContextType {
  hasNotification: boolean
  setNotification: () => void
  clearNotification: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  hasNotification: false,
  setNotification: () => {},
  clearNotification: () => {},
})

export function AnalysisNotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasNotification, setHasNotification] = useState(false)

  useEffect(() => {
    setHasNotification(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  const setNotification = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setHasNotification(true)
  }, [])

  const clearNotification = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHasNotification(false)
  }, [])

  return (
    <NotificationContext.Provider value={{ hasNotification, setNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useAnalysisNotification() {
  return useContext(NotificationContext)
}
