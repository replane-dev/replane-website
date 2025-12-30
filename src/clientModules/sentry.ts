import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'https://0afc47e216e274255b185c77f9f62f0c@o4510523200503808.ingest.de.sentry.io/4510564176756817',

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Button appearance
      colorScheme: 'system',
      buttonLabel: '💬 Send Feedback',
      submitButtonLabel: 'Send Feedback',
      cancelButtonLabel: 'Cancel',

      // Form labels
      formTitle: 'Send Feedback',
      nameLabel: 'Name (optional)',
      namePlaceholder: 'Your name',
      emailLabel: 'Email (optional)',
      emailPlaceholder: 'your@email.com',
      messageLabel: 'Message',
      messagePlaceholder: "What's on your mind?",
      successMessageText: 'Thank you for your feedback!',
      triggerLabel: '',

      // Form behavior
      isNameRequired: false,
      isEmailRequired: false,
      showBranding: false,

      // Attach replay to feedback
      autoInject: false
    })
  ],

  enabled: process.env.NODE_ENV === 'production',

  // Set environment
  environment: process.env.NODE_ENV || 'development'
})

interface RouteLocation {
  pathname: string
}

export function onRouteDidUpdate({
  location,
  previousLocation
}: {
  location: RouteLocation
  previousLocation?: RouteLocation
}) {
  if (location.pathname !== previousLocation?.pathname) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${location.pathname}`,
      level: 'info'
    })
  }
}
