'use client'

import { useEffect } from 'react'
import { useAnalysisNotification } from '@/context/AnalysisNotification'

export default function ClearNotification() {
  const { clearNotification } = useAnalysisNotification()
  useEffect(() => { clearNotification() }, [clearNotification])
  return null
}
