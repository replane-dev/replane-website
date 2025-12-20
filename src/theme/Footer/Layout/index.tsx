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
      <div className='mx-auto max-w-7xl px-4 py-10'>
        {links}
        {(logo || copyright) && (
          <div className='footer__bottom text--center'>
            {logo && <div className='margin-bottom--sm'>{logo}</div>}
            {copyright}
          </div>
        )}
      </div>
    </footer>
  )
}
