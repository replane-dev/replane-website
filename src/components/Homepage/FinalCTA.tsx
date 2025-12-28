import React from 'react'
import Link from '@docusaurus/Link'
import { ArrowRight, Github, Terminal } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className='relative overflow-hidden py-32'>
      {/* Dark background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      {/* Radial gradient glow from center */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-400/[0.07] blur-[100px]' />
      </div>

      {/* Animated gradient border at top */}
      <div className='absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-stone-500/50 to-transparent' />

      <div className='relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          {/* Badge */}
          <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800/50 px-4 py-1.5 text-sm font-medium text-stone-400'>
            <Terminal className='h-4 w-4' />
            Get started in minutes
          </div>

          {/* Heading */}
          <h2 className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Ready to take control?
          </h2>

          <p className='mx-auto mb-12 max-w-xl text-lg leading-relaxed text-stone-400'>
            Deploy once, configure forever. Start with our managed cloud or self-host on your own
            infrastructure.
          </p>

          {/* Terminal preview */}
          <div className='mx-auto mb-12 max-w-lg overflow-hidden rounded-xl border border-stone-800 bg-stone-900/80 shadow-2xl'>
            {/* Terminal header */}
            <div className='flex items-center gap-2 border-b border-stone-800 bg-stone-900 px-4 py-3'>
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <span className='ml-2 text-xs text-stone-500'>terminal</span>
            </div>
            {/* Terminal content */}
            <div className='p-4 font-mono text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-stone-500'>$</span>
                <span className='text-stone-300'>docker run -d replane/replane</span>
              </div>
              <div className='mt-2 text-stone-500'>✓ Replane is running at localhost:3000</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='https://cloud.replane.dev'
              className='group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-stone-900 shadow-lg shadow-white/10 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900 hover:no-underline hover:shadow-white/20'
            >
              Start Free — No Credit Card
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>

            <Link
              to='/docs/getting-started/quickstart'
              className='group inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/50 px-8 py-4 text-base font-semibold text-stone-200 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white hover:no-underline'
            >
              <Github className='h-4 w-4' />
              View on GitHub
            </Link>
          </div>

          {/* Trust line */}
          <p className='mt-12 text-sm text-stone-500'>
            Open source • MIT Licensed • Self-hosted or Cloud
          </p>
        </div>
      </div>
    </section>
  )
}
