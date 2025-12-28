import React from 'react'

interface Company {
  name: string
  logo: string
}

const companies: Company[] = [
  {
    name: 'Mapbox',
    logo: '/img/logos/mapbox.svg'
  },
  {
    name: 'BridgeX',
    logo: '/img/logos/bridgex.svg'
  },
  {
    name: 'Edme',
    logo: '/img/logos/edme.svg'
  },
  {
    name: 'Syncwave',
    logo: '/img/logos/syncwave.svg'
  },
  {
    name: 'Discut',
    logo: '/img/logos/discut.svg'
  },
  {
    name: 'Ainter',
    logo: '/img/logos/ainter.svg'
  }
]

export default function TrustedBy() {
  return (
    <section className='relative py-16'>
      {/* Background - continues from hero */}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center gap-8'>
          {/* Label */}
          <h2 className='text-sm font-medium tracking-wider text-stone-500 uppercase'>
            Trusted by innovative teams
          </h2>

          {/* Logos */}
          <div className='flex flex-wrap items-center justify-center gap-x-20 gap-y-6'>
            {companies.map((company) => (
              <div
                key={company.name}
                className='flex items-center justify-center opacity-50 transition-all duration-300 hover:opacity-100'
                title={company.name}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className='h-8 w-auto object-contain brightness-0 invert'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
