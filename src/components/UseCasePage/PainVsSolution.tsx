import { X, Check, ArrowRight } from 'lucide-react'
import type { AccentColor, PainPoint, Solution } from './types'

interface PainVsSolutionProps {
  painPoints: PainPoint[]
  solutions: Solution[]
  accentColor: AccentColor
}

export default function PainVsSolution({
  painPoints,
  solutions
}: PainVsSolutionProps) {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            The Problem & Solution
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Before & after Replane
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            See how teams transform their workflow
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Pain Points - Before */}
          <div className='rounded-2xl border border-stone-800 bg-stone-900/50 p-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-800'>
                <X className='h-5 w-5 text-stone-400' />
              </div>
              <h3 className='text-xl font-bold text-stone-300'>Without Replane</h3>
            </div>
            <ul className='space-y-4'>
              {painPoints.map((point, idx) => (
                <li key={idx} className='flex items-start gap-3'>
                  <div className='mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-700 bg-stone-800'>
                    <X className='h-3 w-3 text-stone-500' />
                  </div>
                  <div>
                    <p className='font-medium text-stone-200'>{point.title}</p>
                    <p className='text-sm text-stone-400'>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions - After */}
          <div className='rounded-2xl border border-stone-700 bg-stone-800/50 p-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10'>
                <Check className='h-5 w-5 text-emerald-400' />
              </div>
              <h3 className='text-xl font-bold text-stone-100'>With Replane</h3>
            </div>
            <ul className='space-y-4'>
              {solutions.map((solution, idx) => (
                <li key={idx} className='flex items-start gap-3'>
                  <div className='mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10'>
                    <Check className='h-3 w-3 text-emerald-400' />
                  </div>
                  <div>
                    <p className='font-medium text-stone-100'>{solution.title}</p>
                    <p className='text-sm text-stone-400'>{solution.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Arrow indicator for mobile */}
        <div className='mt-8 flex justify-center lg:hidden'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full border border-stone-700 bg-stone-800'>
            <ArrowRight className='h-6 w-6 text-stone-400' />
          </div>
        </div>
      </div>
    </section>
  )
}
