import React from 'react'
import Link from '@docusaurus/Link'

interface Benefit {
  number: string
  title: string
  description: string
  icon: string
}

const benefits: Benefit[] = [
  {
    number: '1',
    title: 'Ship Faster',
    description: 'Deploy features behind flags, roll them out gradually, and toggle them instantly without waiting for CI/CD pipelines.',
    icon: '🚀'
  },
  {
    number: '2',
    title: 'Sleep Better',
    description: 'Instant rollback means mistakes are fixable in seconds. Version history shows exactly who changed what and when.',
    icon: '😴'
  },
  {
    number: '3',
    title: 'Own Your Data',
    description: 'Self-hosted on your infrastructure. No vendor lock-in, no data sharing, full control over your configuration.',
    icon: '🔒'
  },
  {
    number: '4',
    title: 'Empower Your Team',
    description: 'Product managers can toggle features. Ops can adjust rate limits. All safely, with validation and audit logs.',
    icon: '⚡'
  }
]

export default function Benefits() {
  return (
    <section className='bg-white py-20 px-4 dark:bg-gray-800'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Why Teams Choose Replane
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Simple, focused, and self-hosted. Everything you need, nothing you don't.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {benefits.map((benefit, idx) => (
            <div key={idx} className='group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-blue-500'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl shadow-lg'>
                  {benefit.icon}
                </div>
                <span className='text-5xl font-bold text-gray-200 dark:text-gray-700'>
                  {benefit.number}
                </span>
              </div>
              <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>
                {benefit.title}
              </h3>
              <p className='leading-relaxed text-gray-600 dark:text-gray-300'>{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <Link
            to='/docs/getting-started/quickstart'
            className='inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:no-underline hover:text-white dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600'
          >
            Get Started in 5 Minutes →
          </Link>
        </div>
      </div>
    </section>
  )
}
