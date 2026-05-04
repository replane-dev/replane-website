import React from 'react'
import Link from '@docusaurus/Link'
import { Rocket, Shield, Server, Users, ArrowRight } from 'lucide-react'

interface Benefit {
  title: string
  description: string
  icon: React.ReactNode
}

const benefits: Benefit[] = [
  {
    title: 'Ship Faster',
    description:
      'Deploy features behind flags, roll them out gradually, and toggle them instantly without waiting for CI/CD pipelines.',
    icon: <Rocket className='h-7 w-7 text-blue-400' />
  },
  {
    title: 'Sleep Better',
    description:
      'Instant rollback means mistakes are fixable in seconds. Version history shows exactly who changed what and when.',
    icon: <Shield className='h-7 w-7 text-emerald-400' />
  },
  {
    title: 'Your Infrastructure',
    description:
      'Self-host on your infrastructure. Same API, same features, no vendor lock-in.',
    icon: <Server className='h-7 w-7 text-violet-400' />
  },
  {
    title: 'Empower Teams',
    description:
      'Product managers can toggle features. Ops can adjust rate limits. All safely, with validation and audit logs.',
    icon: <Users className='h-7 w-7 text-amber-400' />
  }
]

export default function Benefits() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      {/* Subtle decorative glow */}
      <div className='pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-400/5 blur-[100px]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Why Replane
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Why teams choose Replane
          </h2>
          <p className='max-w-2xl text-lg text-stone-400'>
            Simple, focused, and flexible. Everything you need, nothing you don't.
          </p>
        </div>

        {/* Benefits grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-all duration-300 hover:border-stone-600 hover:shadow-xl'
            >
              {/* Number indicator */}
              <div className='absolute top-4 right-4 text-6xl font-bold text-stone-600/50'>
                {idx + 1}
              </div>

              <div className='relative z-10'>
                {/* Icon */}
                <div className='mb-5 inline-flex rounded-xl bg-stone-800/80 p-3'>
                  {benefit.icon}
                </div>

                {/* Content */}
                <h3 className='mb-3 text-xl font-bold text-stone-100'>{benefit.title}</h3>
                <p className='text-sm leading-relaxed text-stone-400'>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className='mt-12 text-center'>
          <Link
            to='/docs/getting-started/quickstart'
            className='group inline-flex items-center gap-2 rounded-lg bg-stone-100 px-8 py-3.5 text-base font-semibold text-stone-900 transition-all duration-200 hover:bg-stone-200 hover:text-stone-900 hover:no-underline hover:shadow-lg'
          >
            Get Started in 5 Minutes
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </section>
  )
}
