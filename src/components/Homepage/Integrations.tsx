import React from 'react'
import Link from '@docusaurus/Link'
import { ArrowRight, Check } from 'lucide-react'

interface Integration {
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  docsLink: string
}

const integrations: Integration[] = [
  {
    name: 'GitHub',
    description: 'Sign in with your GitHub account using OAuth 2.0',
    icon: (
      <svg viewBox='0 0 24 24' className='h-10 w-10' fill='currentColor'>
        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
      </svg>
    ),
    features: ['OAuth 2.0', 'Single Sign-On', 'Workspace Support'],
    docsLink: '/docs/self-hosting/environment-variables#github-oauth'
  },
  {
    name: 'Google',
    description: 'Sign in with Google accounts for seamless access',
    icon: (
      <svg viewBox='0 0 24 24' className='h-10 w-10' fill='currentColor'>
        <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
        <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
        <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
        <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
      </svg>
    ),
    features: ['OAuth 2.0', 'Google Workspace', 'Domain Restriction'],
    docsLink: '/docs/self-hosting/environment-variables#google-oauth'
  },
  {
    name: 'Okta',
    description: 'Enterprise-grade authentication with Okta SSO',
    icon: (
      <svg viewBox='0 0 24 24' className='h-10 w-10' fill='currentColor'>
        <path d='M11.996 0C5.372 0 0 5.372 0 11.996S5.372 24 11.996 24 24 18.628 24 11.996 18.628 0 11.996 0zm0 19.2a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z' />
      </svg>
    ),
    features: ['Enterprise SSO', 'SAML 2.0', 'Multi-Factor Auth'],
    docsLink: '/docs/self-hosting/environment-variables#okta-oauth'
  },
  {
    name: 'Magic Links',
    description: 'Passwordless email authentication for easy access',
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='h-10 w-10'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      >
        <path
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    features: ['No Password Required', 'Email Verification', 'Secure Tokens'],
    docsLink: '/docs/self-hosting/environment-variables#magic-links'
  }
]

export default function Authentication() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      {/* Subtle decorative glow */}
      <div className='pointer-events-none absolute top-1/4 right-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-stone-400/5 blur-[100px]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Authentication
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Secure authentication
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Multiple authentication options to fit your team's needs. From social logins to
            enterprise SSO.
          </p>
        </div>

        {/* Integrations grid - single row on large screens */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {integrations.map((integration, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-all duration-300 hover:border-stone-600 hover:shadow-xl'
            >
              {/* Icon */}
              <div className='mb-4 shrink-0 text-stone-300 transition-colors group-hover:text-white'>
                {integration.icon}
              </div>

              {/* Title & description */}
              <h3 className='mb-2 text-lg font-bold text-stone-100'>{integration.name}</h3>
              <p className='mb-4 text-sm text-stone-400'>{integration.description}</p>

              {/* Features */}
              <ul className='mb-4 space-y-1.5 pl-1'>
                {integration.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className='flex items-center gap-2 text-xs'>
                    <Check className='h-3.5 w-3.5 shrink-0 text-emerald-500' />
                    <span className='text-stone-400'>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                to={integration.docsLink}
                className='inline-flex items-center gap-2 text-sm font-medium text-stone-300 transition-colors hover:text-stone-100 hover:no-underline'
              >
                Setup Guide
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className='mt-8 text-center text-sm text-stone-500'>
          Configure authentication providers through{' '}
          <Link
            to='/docs/self-hosting/environment-variables'
            className='text-stone-400 underline decoration-stone-600 underline-offset-2 transition-colors hover:text-white hover:decoration-stone-400'
          >
            environment variables
          </Link>{' '}
          during deployment
        </p>
      </div>
    </section>
  )
}
