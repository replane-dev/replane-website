import Link from '@docusaurus/Link'
import { ArrowRight } from 'lucide-react'
import { accentColorClasses, type RelatedUseCase } from './types'

interface RelatedUseCasesProps {
  relatedUseCases: RelatedUseCase[]
}

export default function RelatedUseCases({ relatedUseCases }: RelatedUseCasesProps) {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Related Use Cases
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
            Explore more ways to use Replane
          </h2>
        </div>

        {/* Related use cases grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {relatedUseCases.map((useCase, idx) => {
            const colors = accentColorClasses[useCase.accentColor]
            return (
              <Link
                key={idx}
                to={useCase.href}
                className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 p-6 transition-all duration-300 hover:border-stone-600 hover:bg-stone-900 hover:shadow-xl hover:no-underline'
              >
                {/* Accent indicator */}
                <div className={`mb-4 h-1 w-12 rounded-full ${colors.bg}`} />

                <h3 className='mb-2 text-lg font-bold text-stone-100 group-hover:text-white'>
                  {useCase.title}
                </h3>
                <p className='mb-4 text-sm leading-relaxed text-stone-400'>
                  {useCase.description}
                </p>

                <div className={`flex items-center gap-2 text-sm font-medium ${colors.text}`}>
                  <span>Learn more</span>
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </div>

                {/* Hover glow effect */}
                <div
                  className={`pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full ${colors.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

