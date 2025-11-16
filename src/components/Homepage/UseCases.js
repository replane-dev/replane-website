import React from 'react'
import Link from '@docusaurus/Link'

const useCases = [
  {
    title: 'Feature Flags',
    description: 'Ship code with features off. Enable gradually for 1% → 10% → 100% of users. Kill switch ready if things go wrong.',
    icon: (
      <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
      </svg>
    ),
    link: '/docs/guides/feature-flags'
  },
  {
    title: 'Operational Tuning',
    description: 'Adjust rate limits, cache TTLs, and batch sizes instantly. No deploy, no restart, no downtime.',
    icon: (
      <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
    link: '/docs/guides/operational-tuning'
  },
  {
    title: 'Instant Rollback',
    description: 'Version history tracks every change. When production breaks, revert to safety in seconds.',
    icon: (
      <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
      </svg>
    ),
    link: '/docs/guides/rollback'
  },
  {
    title: 'A/B Testing',
    description: 'Store variant percentages in config. Product team adjusts splits, engineering ships features.',
    icon: (
      <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
      </svg>
    ),
    link: '/docs/guides/ab-testing'
  }
]

export default function UseCases() {
  return (
    <section className='bg-gradient-to-b from-white to-gray-50 py-20 px-4 dark:from-gray-800 dark:to-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Built for Real Teams
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Ship faster, respond to incidents instantly, and give your team control
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className='group relative rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
            >
              <div className='mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50'>
                {useCase.icon}
              </div>
              <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>
                {useCase.title}
              </h3>
              <p className='mb-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                {useCase.description}
              </p>
              <Link
                to={useCase.link}
                className='inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all hover:gap-3 hover:text-blue-700 hover:no-underline dark:text-blue-400 dark:hover:text-blue-300'
              >
                Learn more
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
      </div>
    </section>
  )
}
