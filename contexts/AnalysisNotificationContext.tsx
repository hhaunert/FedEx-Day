'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface Notification {
  id: string
}

interface ContextValue {
  notifications: Notification[]
  addNotification: (id: string) => void
  clearNotifications: () => void
}

const AnalysisNotificationContext = createContext<ContextValue>({
  notifications: [],
  addNotification: () => {},
  clearNotifications: () => {},
})

export function AnalysisNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((id: string) => {
    setNotifications((prev) => [...prev, { id }])
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <AnalysisNotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </AnalysisNotificationContext.Provider>
  )
}

export function useAnalysisNotifications() {
  return useContext(AnalysisNotificationContext)
}
