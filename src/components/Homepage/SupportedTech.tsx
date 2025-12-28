import React from 'react'
import Link from '@docusaurus/Link'

interface Technology {
  name: string
  logo: string
  category: 'javascript' | 'python' | 'dotnet'
}

const technologies: Technology[] = [
  // JavaScript ecosystem
  { name: 'TypeScript', logo: '/img/tech-logos/typescript.svg', category: 'javascript' },
  { name: 'JavaScript', logo: '/img/tech-logos/javascript.svg', category: 'javascript' },
  { name: 'React', logo: '/img/tech-logos/react.svg', category: 'javascript' },
  { name: 'Next.js', logo: '/img/tech-logos/nextjs.svg', category: 'javascript' },
  { name: 'Svelte', logo: '/img/tech-logos/svelte.svg', category: 'javascript' },
  { name: 'Node.js', logo: '/img/tech-logos/nodejs.svg', category: 'javascript' },
  { name: 'Bun', logo: '/img/tech-logos/bun.svg', category: 'javascript' },
  { name: 'Deno', logo: '/img/tech-logos/deno.svg', category: 'javascript' },
  // Python ecosystem
  { name: 'Python', logo: '/img/tech-logos/python.svg', category: 'python' },
  { name: 'Django', logo: '/img/tech-logos/django.svg', category: 'python' },
  { name: 'FastAPI', logo: '/img/tech-logos/fastapi.svg', category: 'python' },
  { name: 'Flask', logo: '/img/tech-logos/flask.svg', category: 'python' },
  // .NET ecosystem
  { name: '.NET', logo: '/img/tech-logos/dotnet.svg', category: 'dotnet' }
]

const sdkLinks = {
  javascript: '/docs/sdk/javascript',
  python: '/docs/sdk/python',
  dotnet: '/docs/sdk/dotnet'
}

export default function SupportedTech() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            SDKs & Integrations
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Works with your stack
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Official SDKs for JavaScript, Python, and .NET. Zero dependencies, real-time updates out
            of the box.
          </p>
        </div>

        {/* Technology grid */}
        <div className='grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7'>
          {technologies.map((tech) => (
            <Link
              key={tech.name}
              to={sdkLinks[tech.category]}
              className='group flex flex-col items-center gap-3 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-stone-700 hover:bg-stone-800/50 hover:no-underline'
              title={tech.name}
            >
              <div className='flex h-12 w-12 items-center justify-center'>
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className='h-10 w-10 object-contain transition-opacity duration-200 group-hover:opacity-100'
                  //   style={{ filter: 'brightness(0) invert(0.7)' }}
                />
              </div>
              <span className='text-center text-xs font-medium text-stone-500 transition-colors group-hover:text-stone-300'>
                {tech.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
