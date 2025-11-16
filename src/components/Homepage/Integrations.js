import React from 'react'
import Link from '@docusaurus/Link'

const authMethods = [
  {
    name: 'GitHub',
    description: 'Sign in with your GitHub account using OAuth 2.0',
    icon: (
      <svg viewBox='0 0 24 24' className='h-16 w-16' fill='currentColor'>
        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
      </svg>
    ),
    features: ['OAuth 2.0', 'Single Sign-On', 'Organization Support'],
    docsLink: '/docs/self-hosting/environment-variables#github-oauth'
  },
  {
    name: 'Okta',
    description: 'Enterprise-grade authentication with Okta SSO',
    icon: (
      <svg viewBox='0 0 24 24' className='h-16 w-16' fill='currentColor'>
        <path d='M11.996 0C5.372 0 0 5.372 0 11.996S5.372 24 11.996 24 24 18.628 24 11.996 18.628 0 11.996 0zm0 19.2a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z' />
      </svg>
    ),
    features: ['Enterprise SSO', 'SAML 2.0', 'Multi-Factor Auth'],
    docsLink: '/docs/self-hosting/environment-variables#okta-oauth'
  }
]

export default function Authentication() {
  return (
    <section className='bg-gray-50 px-4 py-20 dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Secure Authentication
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Choose your preferred authentication method. Both options provide enterprise-grade security.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {authMethods.map((method, idx) => (
            <div
              key={idx}
              className='group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
            >
              <div className='mb-6 flex items-center gap-4'>
                <div className='flex-shrink-0 text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400'>
                  {method.icon}
                </div>
                <div>
                  <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>{method.name}</h3>
                  <p className='text-gray-600 dark:text-gray-300'>{method.description}</p>
                </div>
              </div>

              <ul className='mb-6 space-y-3'>
                {method.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className='flex items-center gap-3'>
                    <svg
                      className='h-5 w-5 flex-shrink-0 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='text-gray-700 dark:text-gray-300'>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={method.docsLink}
                className='inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all hover:gap-3 hover:text-blue-700 hover:no-underline dark:text-blue-400 dark:hover:text-blue-300'
              >
                Setup Guide
                <svg
                  className='h-4 w-4 transition-transform group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Configure authentication providers through environment variables during deployment
          </p>
        </div>
      </div>
    </section>
  )
}
