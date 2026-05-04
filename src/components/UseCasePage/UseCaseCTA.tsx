import Link from '@docusaurus/Link'
import { ArrowRight, Github } from 'lucide-react'
import { accentColorClasses, type AccentColor } from './types'

interface UseCaseCTAProps {
  accentColor: AccentColor
  badge: string
}

export default function UseCaseCTA({ accentColor, badge }: UseCaseCTAProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-[#1c1917]' />
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.glow} opacity-30 blur-[100px]`}
      />

      <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        <div className='rounded-3xl border border-stone-800 bg-stone-900/80 p-12 backdrop-blur-sm'>
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border ${colors.border} ${colors.bgSubtle} px-4 py-1.5 text-sm font-medium ${colors.text}`}
          >
            Get Started with {badge}
          </div>

          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
            Ready to ship faster?
          </h2>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-stone-400'>
            Start using Replane in minutes. Deploy it yourself with Docker and keep your
            configuration stack under your control.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='/docs/getting-started/quickstart#self-hosted'
              className={`group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${colors.gradient} px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:text-white hover:no-underline`}
            >
              Self-Host Replane
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>

            <Link
              href='/docs/getting-started/quickstart#self-hosted'
              className='inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-8 py-4 text-base font-semibold text-stone-100 transition-all duration-200 hover:border-stone-600 hover:bg-stone-700 hover:text-stone-100 hover:no-underline'
            >
              <Github className='h-4 w-4' />
              Self-Host Free
            </Link>
          </div>

          <p className='mt-6 text-sm text-stone-500'>
            No credit card required. MIT licensed. Deploy anywhere.
          </p>
        </div>
      </div>
    </section>
  )
}
