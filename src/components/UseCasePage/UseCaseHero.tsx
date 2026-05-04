import Link from '@docusaurus/Link'
import { ArrowRight, Github } from 'lucide-react'
import { accentColorClasses, type AccentColor } from './types'

interface UseCaseHeroProps {
  badge: string
  title: string
  subtitle: string
  description: string
  accentColor: AccentColor
}

export default function UseCaseHero({
  badge,
  title,
  subtitle,
  description,
  accentColor
}: UseCaseHeroProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative min-h-[70vh] overflow-hidden'>
      {/* Background effects */}
      <div className='pointer-events-none absolute inset-0'>
        <div
          className={`absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.glow} blur-[120px] opacity-50`}
        />
        <div
          className={`absolute top-1/4 right-0 h-[400px] w-[400px] translate-x-1/2 rounded-full ${colors.glow} blur-[100px] opacity-30`}
        />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40'>
        <div className='flex flex-col items-center text-center'>
          {/* Badge */}
          <div
            className={`mb-8 inline-flex items-center gap-2 rounded-full border ${colors.border} ${colors.bgSubtle} px-4 py-2 text-sm font-medium ${colors.text}`}
          >
            <span>{badge}</span>
          </div>

          {/* Main heading */}
          <h1 className='mb-4 max-w-4xl text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl md:text-6xl lg:text-7xl'>
            <span className='block'>{title}</span>
          </h1>

          {/* Subtitle */}
          <p className={`mb-6 text-xl font-medium ${colors.text} sm:text-2xl`}>{subtitle}</p>

          {/* Description */}
          <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-stone-400 sm:text-xl'>
            {description}
          </p>

          {/* CTA buttons */}
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Link
              to='/docs/getting-started/quickstart'
              className={`group inline-flex items-center gap-2 rounded-lg ${colors.bg} px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:opacity-90 hover:text-white hover:no-underline hover:shadow-lg`}
            >
              Quickstart
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>

            <Link
              to='/docs/getting-started/quickstart'
              className='inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-8 py-3.5 text-base font-semibold text-stone-100 transition-all duration-200 hover:border-stone-600 hover:bg-stone-700 hover:text-stone-100 hover:no-underline'
            >
              <Github className='h-4 w-4' />
              View Docs
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
