import React from 'react'
import Link from '@docusaurus/Link'
import { ArrowRight, Sparkles, Github, ExternalLink } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className='relative min-h-[90vh] overflow-hidden'>
      {/* Background effects - subtle gradient with color accent */}
      <div className='pointer-events-none absolute inset-0'>
        {/* Subtle blue ambient glow */}
        <div className='absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/7 blur-[120px]' />
        <div className='absolute top-1/4 right-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-indigo-500/5 blur-[100px]' />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40'>
        <div className='flex flex-col items-center text-center'>
          {/* Badge */}
          <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-2 text-sm font-medium text-stone-300'>
            <Sparkles className='h-4 w-4 text-blue-400' />
            <span>Open Source • MIT License • Self-Hosted</span>
          </div>

          {/* Main heading */}
          <h1 className='mb-6 max-w-4xl text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl md:text-6xl lg:text-7xl'>
            <span className='block'>Stop deploying for</span>
            <span className='mt-2 block leading-20 text-blue-500'>config changes</span>
          </h1>

          {/* Subheading */}
          <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-stone-400 sm:text-xl'>
            Dynamic configuration for apps and services. Feature flags, rate limits, and settings
            with instant rollback, realtime updates, and complete audit trails.
          </p>

          {/* CTA buttons */}
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Link
              to='/docs/getting-started/quickstart'
              className='group inline-flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:text-white hover:no-underline hover:shadow-lg hover:shadow-blue-500/25'
            >
              Quickstart
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>

            <Link
              to='https://github.com/replane-dev/replane'
              className='inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-8 py-3.5 text-base font-semibold text-stone-100 transition-all duration-200 hover:border-stone-600 hover:bg-stone-700 hover:text-stone-100 hover:no-underline'
            >
              <Github className='h-4 w-4' />
              GitHub
            </Link>
          </div>

          {/* Product screenshot */}
          <div className='relative mt-20 w-full max-w-5xl'>
            {/* Subtle glow effect behind screenshot */}
            <div className='absolute -inset-4 rounded-2xl bg-stone-300/5 opacity-30 blur-2xl' />

            {/* Screenshot container */}
            <div className='relative overflow-hidden rounded-xl shadow-2xl ring-1 ring-stone-700'>
              {/* Dark mode screenshot only */}
              <img
                src='/img/screenshots/replane-window-screenshot-dark-v1.png'
                alt='Replane configuration management interface'
                className='w-full'
                loading='lazy'
              />
            </div>
          </div>

          {/* Stats */}
          <div className='mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-stone-100 sm:text-4xl'>99.99%</div>
              <div className='mt-1 text-sm text-stone-500'>uptime</div>
            </div>
            <div className='hidden h-10 w-px bg-stone-700 sm:block' />
            <div className='text-center'>
              <div className='text-3xl font-bold text-stone-100 sm:text-4xl'>{'<'}1s</div>
              <div className='mt-1 text-sm text-stone-500'>update latency</div>
            </div>
            <div className='hidden h-10 w-px bg-stone-700 sm:block' />
            <div className='text-center'>
              <div className='text-3xl font-bold text-stone-100 sm:text-4xl'>{'<'}100ms</div>
              <div className='mt-1 text-sm text-stone-500'>SDK init (p90)</div>
            </div>
            <div className='hidden h-10 w-px bg-stone-700 sm:block' />
            <Link
              href='https://github.com/replane-dev/replane'
              className='group text-center transition-opacity hover:no-underline hover:opacity-80'
            >
              <div className='text-3xl font-bold text-stone-100 sm:text-4xl'>100%</div>
              <div className='mt-1 inline-flex items-center gap-1 text-sm text-stone-500 group-hover:text-stone-400'>
                open source <ExternalLink className='h-3 w-3' />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
