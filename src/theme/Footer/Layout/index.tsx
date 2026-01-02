import React from 'react'
import { useLocation } from '@docusaurus/router'

interface FooterLayoutProps {
  style?: string
  links?: React.ReactNode
  logo?: React.ReactNode
  copyright?: React.ReactNode
}

export default function FooterLayout({ style, links, logo, copyright }: FooterLayoutProps) {
  const location = useLocation()
  const isDarkOnlyPage = location.pathname === '/' || location.pathname.startsWith('/pricing')

  const baseClasses = isDarkOnlyPage
    ? 'border-t border-stone-800 bg-[#0c0a09] text-stone-300'
    : 'border-t border-gray-200 bg-slate-50 dark:border-stone-800 dark:bg-[#0c0a09] dark:text-stone-300'

  return (
    <footer className={baseClasses}>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
        {/* Links section - responsive grid */}
        <div className='footer-links-wrapper'>{links}</div>

        {/* Bottom section */}
        {(logo || copyright) && (
          <div className='mt-10 pt-8 text-center'>
            {logo && <div className='mb-4'>{logo}</div>}
            {copyright && (
              <p
                className={
                  isDarkOnlyPage
                    ? 'text-sm text-stone-500'
                    : 'text-sm text-gray-500 dark:text-stone-500'
                }
              >
                {copyright}
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .footer-links-wrapper .row {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 2rem;
        }
        
        @media (min-width: 640px) {
          .footer-links-wrapper .row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 768px) {
          .footer-links-wrapper .row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .footer-links-wrapper .row {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
        
        .footer-links-wrapper .col {
          padding: 0;
        }
        
        .footer-links-wrapper .footer__title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        
        .footer-links-wrapper .footer__items {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links-wrapper .footer__item {
          margin-bottom: 0.5rem;
        }
        
        .footer-links-wrapper .footer__link-item {
          font-size: 0.875rem;
          transition: color 0.15s ease;
        }
        
        .footer-links-wrapper .footer__link-item:hover {
          color: white;
        }
      `}</style>
    </footer>
  )
}
