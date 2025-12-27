import React from 'react'
import Link from '@docusaurus/Link'

export default function FinalCTA() {
  return (
    <section className='bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 dark:from-blue-700 dark:to-purple-700'>
      <div className='mx-auto max-w-4xl text-center'>
        <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>
          Ready to Stop Deploying for Config Changes?
        </h2>
        <p className='mb-8 text-lg text-blue-100 sm:text-xl'>
          Start with our managed cloud or self-host on your infrastructure. Open source and free forever.
        </p>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Link
            href='https://cloud.replane.dev'
            className='inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-600 transition-all hover:bg-gray-100 hover:no-underline hover:text-blue-700'
          >
            Try Cloud Free
          </Link>
          <Link
            to='/docs/getting-started/quickstart'
            className='inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white hover:text-blue-600 hover:no-underline'
          >
            Self-Host
          </Link>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-white'>Instant</div>
            <div className='text-sm text-blue-100'>cloud start</div>
          </div>
          <div className='hidden h-12 w-px bg-blue-300 sm:block'></div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-white'>5 min</div>
            <div className='text-sm text-blue-100'>self-host deploy</div>
          </div>
          <div className='hidden h-12 w-px bg-blue-300 sm:block'></div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-white'>MIT</div>
            <div className='text-sm text-blue-100'>open source</div>
          </div>
        </div>
      </div>
    </section>
  )
}
