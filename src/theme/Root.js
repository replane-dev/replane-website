import React, { useEffect, useRef } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useLocation } from '@docusaurus/router'
import * as Sentry from '@sentry/react'

function FeedbackWidget() {
  const location = useLocation()
  const widgetRef = useRef(null)
  const isDocsPage = location.pathname.startsWith('/docs')

  useEffect(() => {
    if (isDocsPage && !widgetRef.current) {
      const feedback = Sentry.getFeedback()
      if (feedback) {
        widgetRef.current = feedback.createWidget()
      }
    } else if (!isDocsPage && widgetRef.current) {
      widgetRef.current.removeFromDom()
      widgetRef.current = null
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeFromDom()
        widgetRef.current = null
      }
    }
  }, [isDocsPage])

  return null
}

function FeedbackWidgetWrapper() {
  return <BrowserOnly fallback={null}>{() => <FeedbackWidget />}</BrowserOnly>
}

export default function Root({ children }) {
  return (
    <>
      {children}
      <FeedbackWidgetWrapper />
    </>
  )
}
