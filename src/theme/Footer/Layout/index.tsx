import React from 'react'

interface FooterLayoutProps {
  style?: string
  links?: React.ReactNode
  logo?: React.ReactNode
  copyright?: React.ReactNode
}

export default function FooterLayout({ style, links, logo, copyright }: FooterLayoutProps) {
  return (
    <footer className='border-t border-gray-200 bg-slate-50 dark:border-gray-800 dark:bg-slate-950/50'>
      <div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14'>
        <div>{links}</div>
        <div>
          {(logo || copyright) && (
            <div className='footer__bottom text--center'>
              {logo && <div className='margin-bottom--sm'>{logo}</div>}
              {copyright}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
