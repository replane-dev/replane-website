import { accentColorClasses, type AccentColor, type Feature } from './types'

interface UseCaseFeaturesProps {
  features: Feature[]
  accentColor: AccentColor
  heading?: string
  subheading?: string
}

export default function UseCaseFeatures({
  features,
  accentColor,
  heading = 'Built for modern teams',
  subheading = 'Everything you need to manage configuration at scale'
}: UseCaseFeaturesProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Key Features
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            {heading}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            {subheading}
          </p>
        </div>

        {/* Features grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-all duration-300 hover:border-stone-600'
            >
              {/* Icon */}
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bgSubtle}`}
              >
                <div className={colors.text}>{feature.icon}</div>
              </div>

              {/* Content */}
              <h3 className='mb-2 text-lg font-bold text-stone-100'>{feature.title}</h3>
              <p className='text-sm leading-relaxed text-stone-400'>{feature.description}</p>

              {/* Hover glow effect */}
              <div
                className={`pointer-events-none absolute -right-16 -bottom-16 h-32 w-32 rounded-full ${colors.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
