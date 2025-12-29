import { accentColorClasses, type AccentColor, type Benefit } from './types'

interface BenefitsProps {
  benefits: Benefit[]
  accentColor: AccentColor
}

export default function Benefits({ benefits, accentColor }: BenefitsProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Benefits
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Why teams choose Replane
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Built for developers who value speed, reliability, and control
          </p>
        </div>

        {/* Benefits grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-8 transition-all duration-300 hover:border-stone-600 hover:shadow-xl'
            >
              {/* Icon */}
              <div className={`mb-5 inline-flex rounded-xl ${colors.bgSubtle} p-3`}>
                <div className={colors.text}>{benefit.icon}</div>
              </div>

              {/* Content */}
              <h3 className='mb-3 text-xl font-bold text-stone-100'>{benefit.title}</h3>
              <p className='leading-relaxed text-stone-400'>{benefit.description}</p>

              {/* Hover glow effect */}
              <div
                className={`pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full ${colors.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

