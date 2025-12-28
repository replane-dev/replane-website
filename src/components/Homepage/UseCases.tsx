import React from 'react'
import Link from '@docusaurus/Link'
import { Flag, Settings, RotateCcw, BarChart3, ArrowRight } from 'lucide-react'

interface UseCase {
  title: string
  description: string
  icon: React.ReactNode
  link: string
}

const useCases: UseCase[] = [
  {
    title: 'Feature Flags',
    description:
      'Ship code with features off. Enable gradually for 1% → 10% → 100% of users. Kill switch ready if things go wrong.',
    icon: <Flag className='h-6 w-6 text-blue-400' />,
    link: '/docs/guides/feature-flags'
  },
  {
    title: 'Operational Tuning',
    description:
      'Adjust rate limits, cache TTLs, and batch sizes instantly. No deploy, no restart, no downtime.',
    icon: <Settings className='h-6 w-6 text-violet-400' />,
    link: '/docs/guides/operational-tuning'
  },
  {
    title: 'Instant Rollback',
    description:
      'Version history tracks every change. When production breaks, revert to safety in seconds.',
    icon: <RotateCcw className='h-6 w-6 text-emerald-400' />,
    link: '/docs/guides/gradual-rollouts#ab-testing'
  },
  {
    title: 'A/B Testing',
    description:
      'Store variant percentages in config. Product team adjusts splits, engineering ships features.',
    icon: <BarChart3 className='h-6 w-6 text-amber-400' />,
    link: '/docs/guides/gradual-rollouts#ab-testing'
  }
]

export default function UseCases() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Use Cases
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Built for real teams
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Ship faster, respond to incidents instantly, and give your team control
          </p>
        </div>

        {/* Use cases grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {useCases.map((useCase, idx) => (
            <Link
              key={idx}
              to={useCase.link}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-8 transition-all duration-300 hover:border-stone-600 hover:shadow-xl hover:no-underline'
            >
              {/* Icon */}
              <div className='mb-5 inline-flex rounded-xl bg-stone-800/80 p-3'>
                {useCase.icon}
              </div>

              {/* Content */}
              <h3 className='mb-3 text-xl font-bold text-stone-100'>{useCase.title}</h3>
              <p className='mb-6 leading-relaxed text-stone-400'>{useCase.description}</p>

              {/* Link */}
              <div className='flex items-center gap-2 text-sm font-medium text-stone-300'>
                <span>Learn more</span>
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
