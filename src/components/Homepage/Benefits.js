import React from 'react'
import Link from '@docusaurus/Link'

const benefits = [
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
    icon: '👥'
  }
]

export default function Benefits() {
  return (
    <section className='py-16 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Why Teams Choose Replane
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Simple, focused, and self-hosted. Everything you need, nothing you don't.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {benefits.map((benefit, idx) => (
            <div key={idx} className='relative'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900'>
                  {benefit.icon}
                </div>
                <span className='text-5xl font-bold text-gray-200 dark:text-gray-700'>
                  {benefit.number}
                </span>
              </div>
              <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                {benefit.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Link
            to='/docs/getting-started/quickstart'
            className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:no-underline hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600'
          >
            Get Started in 5 Minutes
          </Link>
        </div>
      </div>
    </section>
  )
}
