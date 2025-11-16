import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

export default function HeroBanner() {
  return (
    <div>
      <div className='px-4 py-12 sm:py-20'>
        <div className='mx-auto max-w-5xl'>
          <div className='text-center'>
            <div className='group relative mx-auto flex w-max items-center justify-center rounded-full bg-white px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-transparent'>
              <span
                className={cn(
                  'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px'
                )}
                style={{
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'subtract',
                  WebkitClipPath: 'padding-box'
                }}
              />
              <AnimatedGradientText className='text-sm font-medium'>
                Open Source • Self-Hosted • MIT License
              </AnimatedGradientText>
            </div>

            <h1 className='mt-6 mb-6 text-[32px] leading-tight font-bold text-gray-900 sm:mt-8 sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white'>
              Versioned, Auditable
              <br className='hidden sm:block' />
              <span className='sm:hidden'> </span>
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400'>
                Application Configuration
              </span>
            </h1>

            <p className='mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-600 sm:mb-10 sm:text-xl dark:text-gray-300'>
              Stop deploying code to change a setting. Manage feature flags, rate limits, and config values
              with instant rollback, realtime updates, and complete audit trails—all on your infrastructure.
            </p>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                to='/docs/getting-started/quickstart'
                className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:text-white hover:no-underline dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                Get Started
              </Link>
              <Link
                href='https://github.com/replane-dev/replane'
                className='inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:no-underline dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white'
              >
                View on GitHub
              </Link>
            </div>

            {/* <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
              <code className='rounded bg-gray-100 px-2 py-1 dark:bg-gray-800'>
                npm install replane-sdk
              </code>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
