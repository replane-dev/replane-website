import { accentColorClasses, type AccentColor, type Feature } from './types'

interface UseCaseFeaturesProps {
  features: Feature[]
  accentColor: AccentColor
}

export default function UseCaseFeatures({ features, accentColor }: UseCaseFeaturesProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-20'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl'>
            Key Features
          </h2>
        </div>

        {/* Features grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className='group rounded-xl border border-stone-800 bg-stone-900/50 p-6 transition-all hover:border-stone-700 hover:bg-stone-900/80'
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bgSubtle} ${colors.text}`}
              >
                {feature.icon}
              </div>

              {/* Text content */}
              <h3 className='mb-2 font-semibold text-stone-100'>{feature.title}</h3>
              <p className='text-sm leading-relaxed text-stone-400'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

