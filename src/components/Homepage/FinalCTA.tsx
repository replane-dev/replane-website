import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { ArrowRight, Github, Terminal, Copy, Check } from 'lucide-react'

const DOCKER_COMMAND = `docker run -p 8080:8080 -e BASE_URL=http://localhost:8080 -e SECRET_KEY=xxx replane/replane`

export default function FinalCTA() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(DOCKER_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className='relative overflow-hidden py-32'>
      {/* Dark background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      {/* Radial gradient glow from center with blue accent */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/8 blur-[100px]' />
      </div>

      {/* Animated gradient border at top */}
      <div className='absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-stone-500/50 to-transparent' />

      <div className='relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          {/* Badge */}
          <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800/50 px-4 py-1.5 text-sm font-medium text-stone-400'>
            <Terminal className='h-4 w-4 text-blue-400' />
            Get started in minutes
          </div>

          {/* Heading */}
          <h2 className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Ready to take control?
          </h2>

          <p className='mx-auto mb-12 max-w-xl text-lg leading-relaxed text-stone-400'>
            Update configs without deploying code. Start with our managed cloud or self-host on your
            own infrastructure.
          </p>

          {/* Terminal preview */}
          <div className='mx-auto mb-12 max-w-lg overflow-hidden rounded-xl border border-stone-800 bg-stone-900/80 shadow-2xl lg:max-w-4xl'>
            {/* Terminal header */}
            <div className='flex items-center gap-2 border-b border-stone-800 bg-stone-900 px-4 py-3'>
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <div className='h-3 w-3 rounded-full bg-stone-700' />
              <span className='ml-2 text-xs text-stone-500'>self-hosted</span>
              <button
                onClick={handleCopy}
                className='ml-auto flex items-center gap-1.5 rounded-md bg-transparent px-2 py-1 text-xs text-stone-200 transition-colors hover:bg-stone-800 hover:text-stone-100'
                aria-label='Copy command'
              >
                {copied ? (
                  <>
                    <Check className='h-3.5 w-3.5 text-emerald-500' />
                    <span className='text-emerald-500'>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className='h-3.5 w-3.5' />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {/* Terminal content */}
            <div className='p-4 text-left font-mono text-sm'>
              <div className='flex items-start gap-2'>
                <span className='text-stone-500'>$</span>
                {/* Single line for large screens (works in PowerShell/cmd.exe) */}
                <span className='hidden text-stone-300 lg:inline'>
                  docker run -p 8080:8080 -e BASE_URL=http://localhost:8080 -e SECRET_KEY=xxx
                  replane/replane
                </span>
                {/* Multi-line for smaller screens */}
                <span className='text-stone-300 lg:hidden'>
                  docker run -p 8080:8080 \ <br />
                  &nbsp;&nbsp;-e BASE_URL=http://localhost:8080 \ <br />
                  &nbsp;&nbsp;-e SECRET_KEY=xxx \ <br />
                  &nbsp;&nbsp;replane/replane
                </span>
              </div>
              <div className='mt-2 text-emerald-500'>✓ Replane is running at localhost:8080</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='https://cloud.replane.dev'
              className='group inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:no-underline hover:shadow-blue-500/30'
            >
              Try Replane Cloud — Free forever
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>

            <Link
              to='https://github.com/replane-dev/replane'
              className='group inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/50 px-8 py-4 text-base font-semibold text-stone-200 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white hover:no-underline'
            >
              <Github className='h-4 w-4' />
              View on GitHub
            </Link>
          </div>

          {/* Trust line */}
          <p className='mt-12 text-sm text-stone-500'>
            Open source • MIT Licensed • Self-hosted or Cloud
          </p>
        </div>
      </div>
    </section>
  )
}
