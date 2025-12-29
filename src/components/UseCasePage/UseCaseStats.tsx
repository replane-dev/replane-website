import { accentColorClasses, type AccentColor, type Stat } from './types'

interface UseCaseStatsProps {
  stats: Stat[]
  accentColor: AccentColor
}

export default function UseCaseStats({ stats, accentColor }: UseCaseStatsProps) {
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-16'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-stone-800 bg-stone-900/50 p-8 backdrop-blur-sm lg:p-12'>
          <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
            {stats.map((stat, idx) => (
              <div key={idx} className='text-center'>
                <div className={`mb-2 text-4xl font-bold tracking-tight lg:text-5xl ${colors.text}`}>
                  {stat.value}
                </div>
                <div className='mb-1 text-lg font-medium text-stone-200'>{stat.label}</div>
                {stat.description && (
                  <div className='text-sm text-stone-500'>{stat.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

