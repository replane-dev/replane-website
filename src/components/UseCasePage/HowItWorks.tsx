import { accentColorClasses, type AccentColor, type Step } from './types'

interface HowItWorksProps {
  steps: Step[]
  accentColor: AccentColor
}

export default function HowItWorks({ steps, accentColor }: HowItWorksProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            How It Works
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Three simple steps
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Get up and running in minutes, not hours
          </p>
        </div>

        {/* Steps */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {steps.map((step, idx) => (
            <div key={idx} className='relative'>
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className='absolute top-12 left-1/2 hidden h-px w-full bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 md:block' />
              )}

              <div className='relative flex flex-col items-center text-center'>
                {/* Step number */}
                <div
                  className={`mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border ${colors.border} ${colors.bgSubtle}`}
                >
                  <div className={`${colors.text}`}>{step.icon}</div>
                </div>

                {/* Step indicator */}
                <div
                  className={`mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full ${colors.bg} text-sm font-bold text-white`}
                >
                  {idx + 1}
                </div>

                {/* Content */}
                <h3 className='mb-3 text-xl font-bold text-stone-100'>{step.title}</h3>
                <p className='leading-relaxed text-stone-400'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

