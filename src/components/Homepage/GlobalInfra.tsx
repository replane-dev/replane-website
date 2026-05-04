import React from 'react'
import { Globe, Zap } from 'lucide-react'

interface Location {
  name: string
  region: string
  position: { top: string; left: string }
}

const locations: Location[] = [
  {
    name: 'Los Angeles',
    region: 'US West',
    position: { top: '32%', left: '12%' }
  },
  { name: 'Ashburn', region: 'US East', position: { top: '25%', left: '23%' } },
  { name: 'Frankfurt', region: 'Europe', position: { top: '20%', left: '45%' } },
  {
    name: 'Singapore',
    region: 'Asia Pacific',
    position: { top: '52%', left: '74%' }
  },
  { name: 'Tokyo', region: 'Japan', position: { top: '26%', left: '79.5%' } }
]

export default function GlobalInfra() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            <Globe className='h-4 w-4 text-blue-400' />
            Global Infrastructure
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Low latency, globally
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Replane can be deployed across regions to keep config reads close to your applications
            and users.
          </p>
        </div>

        {/* Map container */}
        <div className='relative mx-auto max-w-4xl'>
          {/* World map background */}
          <div className='relative aspect-2/1 w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50'>
            {/* Dotted world map */}
            <img
              src='/img/world-map-dots.svg'
              alt='World map'
              className='absolute inset-0 h-full w-full opacity-30'
            />

            {/* Location markers */}
            {locations.map((location) => (
              <div
                key={location.name}
                className='group absolute'
                style={{ top: location.position.top, left: location.position.left }}
              >
                {/* Pulse effect */}
                <div className='absolute -inset-2 animate-ping rounded-full bg-blue-500/30' />
                {/* Marker dot */}
                <div className='relative h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50' />
                {/* Tooltip */}
                <div className='absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-stone-800 px-3 py-1.5 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100'>
                  <div className='font-semibold text-white'>{location.name}</div>
                  <div className='text-stone-400'>{location.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className='mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
          {locations.map((location) => (
            <div
              key={location.name}
              className='rounded-xl border border-stone-800 bg-stone-900/50 p-4 text-center transition-colors hover:border-stone-700'
            >
              <div className='mb-1 flex items-center justify-center gap-1.5'>
                <div className='h-2 w-2 rounded-full bg-emerald-500' />
                <span className='text-xs text-emerald-500'>Online</span>
              </div>
              <div className='font-semibold text-stone-100'>{location.name}</div>
              <div className='text-xs text-stone-500'>{location.region}</div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className='mt-8 flex items-center justify-center gap-2 text-sm text-stone-500'>
          <Zap className='h-4 w-4 text-amber-400' />
          <span>Automatic routing to nearest region • 99.99% uptime</span>
        </div>
      </div>
    </section>
  )
}
